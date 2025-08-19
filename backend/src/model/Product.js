import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  description: String,
  ingredients: String,
  idealFor: String,
  shelfLife: String,
  manufacturer: String,
  category: String,
  fssai: String,
  size: String,
  images: [String],
  mfgdate: {
    type: Date,
    required: true 
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

 const Product = mongoose.model('Product', productSchema);
export default Product;
