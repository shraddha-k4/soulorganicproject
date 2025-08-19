
import Product from '../model/Product.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import Order from '../model/Order.js'

export const addProduct = async (req, res) => {
  try {
    const { name, brand, price, description, ingredients, idealFor, shelfLife, manufacturer, category, fssai, size, mfgdate } = req.body;

    let imageUrls = [];

    // Upload all images to cloudinary
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
      });

      imageUrls.push(result.secure_url);

      // delete local file after upload
      fs.unlinkSync(file.path);
    }

    const product = new Product({
      name,
      brand,
      price,
      description,
      ingredients,
      idealFor,
      shelfLife,
      manufacturer,
      category,
      fssai,
      size,
      images: imageUrls,
       mfgdate,
      seller: req.user.id, // from verifyToken middleware
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};



export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// export const getSingleProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Not found' });

//     const formattedProduct = {
//       ...product.toObject(),
//       mfgdate: product.mfgdate
//         ? product.mfgdate.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//           })
//         : null
//     };

//     res.json(formattedProduct);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Trim ID if it has newline or space
    const trimmedId = id.trim();

    // Handle Cloudinary image upload
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'products', // Cloudinary मध्ये 'products' नावाचा फोल्डर
        });
      });

      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map((result) => result.secure_url);
      updatedData.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      trimmedId,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const trimmedId = id.trim();

//     // Handle Cloudinary image upload
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) => {
//         return cloudinary.uploader.upload(file.path, {
//           folder: 'products',
//         });
//       });

//       const results = await Promise.all(uploadPromises);
//       const imageUrls = results.map((result) => result.secure_url);
//       updatedData.images = imageUrls;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       trimmedId,
//       updatedData,
//       { new: true }
//     );

//     // Format mfgdate before sending response
//     const formattedProduct = {
//       ...updatedProduct.toObject(),
//       mfgdate: updatedProduct.mfgdate
//         ? updatedProduct.mfgdate.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//           })
//         : null
//     };

//     res.status(200).json(formattedProduct);
//   } catch (err) {
//     res.status(500).json({ message: 'Update failed', error: err });
//   }
// };

export const getSellerSummary = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 1. Count seller's products
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // 2. Get all product IDs of this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
    const productIds = sellerProducts.map(p => p._id.toString());

    // 3. Find orders that include any of these products
    const orders = await Order.find({ "items.productId": { $in: sellerProducts } });

    // 4. Count how many times seller's products appear in order items
    let totalOrderedProducts = 0;
    let totalEarnings = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        const itemProductId = item.productId.toString();
        if (productIds.includes(itemProductId)) {
          totalOrderedProducts += 1; // ✅ Count product appearance, not quantity

          if (order.status === "Delivered") {
            totalEarnings += item.totalAmount;
          }
        }
      });
    });

    res.json({
      totalProducts,
      totalOrders: totalOrderedProducts, // ✅ Total product appearances in orders
      totalEarnings,
    });
  } catch (err) {
    console.error("Error in getSellerSummary:", err);
    res.status(500).json({ message: err.message });
  }
};