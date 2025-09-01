import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileno: {
    type: Number,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "seller"],
    default: "customer",
  },
  address: {
    city: { type: String },
    dist:{type:String},
    state: { type: String },
    pincode: { type: Number },
    country: { type: String, default: "India" },
  },
  image: {
    type: String, // इथे Cloudinary URL save होईल
  },
  
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
