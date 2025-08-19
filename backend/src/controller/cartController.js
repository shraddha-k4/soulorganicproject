import Cart from '../model/Cart.js';
import Product from '../model/Product.js'
// Add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save(); // ✅ save mutation
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ cart: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ FILTER WITH BOTH .toString() MATCH OR .equals() FOR SAFETY
    cart.items = cart.items.filter((item) => {
      return item.productId.toString() !== productId;
    });

    await cart.save();

    // Populate updated cart with full product data
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    res.status(200).json({
      message: "Item removed",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






export const getSellerCartSummary = async (req, res) => {
  const sellerId = req.user.id;

  try {
    // ✅ Get all products of this seller
    const sellerProducts = await Product.find({ seller: sellerId });

    // ✅ Map product IDs
    const productIds = sellerProducts.map((p) => p._id);

    // ✅ Aggregate cart data
    const cartSummary = await Cart.aggregate([
      { $unwind: "$items" },
      { $match: { "items.productId": { $in: productIds } } },
      {
        $group: {
          _id: "$items.productId",
          count: { $sum: "$items.quantity" } // counting quantity, not just cart entries
        }
      }
    ]);

    // ✅ Create a lookup map
    const summaryMap = {};
    cartSummary.forEach((item) => {
      summaryMap[item._id.toString()] = item.count;
    });

    // ✅ Return summary with product info
    const result = sellerProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      addedToCartCount: summaryMap[product._id.toString()] || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
