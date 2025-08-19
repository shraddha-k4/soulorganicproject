// controllers/orderController.js

import Order from "../model/Order.js";
import Product from "../model/Product.js";

// export const createOrder = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const buyerId = req.user.id;

//     // 🔍 Quantity ची वैधता तपासा
//     const quantityNum = Number(quantity);
//     if (!productId || isNaN(quantityNum) || quantityNum < 1) {
//       return res.status(400).json({ message: "Invalid product ID or quantity" });
//     }

//     // 🛒 DB मधून प्रॉडक्ट मिळवा
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const price = Number(product.price);
//     if (isNaN(price)) {
//       return res.status(500).json({ message: "Invalid product price in database" });
//     }

//     const totalAmount = price * quantityNum;

//     // 🔄 युजरसाठी ऑर्डर अस्तित्वात आहे का ते तपासा
//     let order = await Order.findOne({ buyerId });

//     if (order) {
//       // ✅ आधीच ऑर्डरमध्ये प्रॉडक्ट आहे का ते तपासा
//       const existingItem = order.items.find(
//         item => item.productId.toString() === productId
//       );

//       if (existingItem) {
//         // 🔁 जर प्रॉडक्ट आधीच आहे, तर quantity आणि totalAmount अपडेट करा
//         existingItem.quantity += quantityNum;
//         existingItem.totalAmount += totalAmount;
//       } else {
//         // ➕ नवीन प्रॉडक्ट जोडा
//         order.items.push({ productId, quantity: quantityNum, price, totalAmount });
//       }

//       await order.save();
//     } else {
//       // 🆕 नवीन युजरसाठी ऑर्डर तयार करा
//       order = await Order.create({
//         buyerId,
//         items: [{ productId, quantity: quantityNum, price, totalAmount }],
//       });
//     }

//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;

    // 🔍 Validate quantity
    const quantityNum = Number(quantity);
    if (!productId || isNaN(quantityNum) || quantityNum < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    // 🛒 Fetch product from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = Number(product.price);
    if (isNaN(price)) {
      return res.status(500).json({ message: "Invalid product price in database" });
    }

    const totalAmount = price * quantityNum;

    // 📦 Prepare item data with date
    const itemData = {
      productId,
      quantity: quantityNum,
      price,
      totalAmount,
      date: new Date(), // ⏰ Add current timestamp
    };

    // 🔄 Check if order already exists for user
    let order = await Order.findOne({ buyerId });

    if (order) {
      // ✅ Check if product already exists in order
      const existingItem = order.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        // 🔁 Update quantity and totalAmount
        existingItem.quantity += quantityNum;
        existingItem.totalAmount += totalAmount;
        // Optionally update date if needed
        // existingItem.date = new Date();
      } else {
        // ➕ Add new product to order
        order.items.push(itemData);
      }

      await order.save();
    } else {
      // 🆕 Create new order for user
      order = await Order.create({
        buyerId,
        items: [itemData],
      });
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ Get orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 🔍 Find all products listed by this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
    const productIds = sellerProducts.map(p => p._id.toString()); // Convert to strings

    // 🔍 Find all orders that include any of these products
    const orders = await Order.find({ "items.productId": { $in: sellerProducts } })
      .populate("items.productId", "name price images")
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 });

    // 🧹 Filter items in each order to include only seller's products
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(item =>
        productIds.includes(item.productId._id.toString())
      );

      return {
        _id: order._id,
        buyer: order.buyerId,
        items: sellerItems,
        status: order.status,
        createdAt: order.createdAt,
      };
    });

    // 🧼 Remove orders with no matching items
    const finalOrders = filteredOrders.filter(order => order.items.length > 0);

    res.json(finalOrders);
  } catch (error) {
    console.error("Seller orders fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params; // itemId म्हणजे त्या specific product चा order item
    const { status } = req.body;
    const sellerId = req.user.id;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // ऑर्डर शोधा
    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // तो specific item शोधा
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Seller authorization check
    if (item.productId.seller.toString() !== sellerId) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Status update करा
    item.status = status;
    await order.save();

    res.json({ message: "Order item status updated successfully", order });
  } catch (error) {
    console.error("Order item status update error:", error);
    res.status(500).json({ message: error.message });
  }
};


// controllers/orderController.js
export const removeOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const userId = req.user.id;

    // 🔍 Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Check if the order belongs to the logged-in user
    if (order.buyerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to modify this order" });
    }

    // 🔍 Check if item exists
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // ❌ Prevent removal if item is already delivered
    if (item.status === "Delivered") {
      return res.status(400).json({ message: "Delivered items cannot be cancelled" });
    }

    // ✅ Remove item using .pull()
    order.items.pull(itemId);

    // 💾 Save updated order
    await order.save();

    res.json({ message: "Order item removed successfully", order });
  } catch (error) {
    console.error("Remove order item error:", error);
    res.status(500).json({ message: error.message });
  }
};