import Wishlist from '../model/wishlist.js';


export const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const alreadyExists = wishlist.items.find(item =>
      item.productId.toString() === productId
    );

    if (alreadyExists) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    wishlist.items.push({ productId });
    await wishlist.save();

    res.status(200).json({ message: 'Added to wishlist', wishlist });
  } catch (error) {
    console.error("Wishlist Add Error:", error); // 🛠 Log the actual error
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message || error });
  }
};


export const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: wishlist.items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

export const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({ message: 'Removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};
