import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Add_Product_Api } from '../../api/ApiEndPoints.jsx';
import SellerSidebar from './SellerSidebar.jsx';
import SellerNavbar from './SellerNavbar.jsx';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    ingredients: '',
    idealFor: '',
    shelfLife: '',
    manufacturer: '',
    fssai: '',
    size: '',
    category: '',
    images: [],
  });

  const [imageNames, setImageNames] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setImageNames(files.map((file) => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, value);
        }
      });

      const token = localStorage.getItem('token');

      const response = await axios.post(Add_Product_Api, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Product added successfully!');
      console.log('Server response:', response.data);

      // Reset form
      setForm({
        name: '',
        brand: '',
        price: '',
        description: '',
        ingredients: '',
        idealFor: '',
        shelfLife: '',
        manufacturer: '',
        fssai: '',
        size: '',
        category: '',
        images: [],
      });
      setImageNames([]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Check console for details.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>

      <div className="flex-1 p-4 pb-20 md:pb-4">
        {/* <SellerNavbar /> */}

        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl font-bold text-green-800 space-y-4"
            variants={inputVariants}
          >
            Add New Product
          </motion.h1>

          <div className="h-4" />

          <form onSubmit={handleSubmit} className="space-y-1">
            <motion.div variants={inputVariants}>
              <label
                htmlFor="category"
                className="block font-medium mb-1 text-gray-800"
              >
                Product Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Category --</option>
                <option value="Food Products">Food Products</option>
                <option value="Personal Care Products">
                  Personal Care Products
                </option>
                <option value="Household Products">Household Products</option>
                <option value="Herbal Products">Herbal Products</option>
                <option value="Baby Products">Baby Products</option>
              </select>
            </motion.div>

            {/* Add spacing after category */}
            <div className="h-1" />

            {/* {[
              {
                name: 'name',
                placeholder: 'Product Name',
                label: 'Product Name',
              },
              {
                name: 'brand',
                placeholder: 'Brand Name',
                label: 'Brand Name',
              },
              { name: 'price', placeholder: 'Price', label: 'Price' },
              {
                name: 'size',
                placeholder: 'Size (e.g. 1kg, 500g)',
                label: 'Size',
              },
              {
                name: 'ingredients',
                placeholder: 'Ingredients',
                label: 'Ingredients',
              },
              {
                name: 'idealFor',
                placeholder: 'Ideal For Making (e.g. Rotis, Parathas)',
                label: 'Ideal For Making',
              },
              {
                name: 'shelfLife',
                placeholder: 'Shelf Life (e.g. 9 months)',
                label: 'Shelf Life',
              },
              {
                name: 'manufacturer',
                placeholder: 'Marketed & Manufactured By',
                label: 'Marketed & Manufactured By',
              },
              {
                name: 'fssai',
                placeholder: 'FSSAI Number',
                label: 'FSSAI Number',
              },
              {
                name: 'mfgdate',
                placeholder: 'Manufacture Date',
                label: 'MFG Date',
              },
            ].map(({ name, placeholder, label }) => (
              <motion.div key={name} variants={inputVariants}>
                <label
                  htmlFor={name}
                  className="block font-medium mb-1 text-gray-800"
                >
                  {label}
                </label>
                <input
                  id={name}
                  type="text"
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            ))} */}

            {[
              { name: 'name', placeholder: 'Product Name', label: 'Product Name', type: 'text' },
              { name: 'brand', placeholder: 'Brand Name', label: 'Brand Name', type: 'text' },
              { name: 'price', placeholder: 'Price', label: 'Price', type: 'number' },
              { name: 'size', placeholder: 'Size (e.g. 1kg, 500g)', label: 'Size', type: 'text' },
              { name: 'ingredients', placeholder: 'Ingredients', label: 'Ingredients', type: 'text' },
              { name: 'idealFor', placeholder: 'Ideal For Making (e.g. Rotis, Parathas)', label: 'Ideal For', type: 'text' },
              { name: 'shelfLife', placeholder: 'Shelf Life (e.g. 9 months)', label: 'Shelf Life', type: 'text' },
              { name: 'manufacturer', placeholder: 'Marketed & Manufactured By', label: 'Manufacturer', type: 'text' },
              { name: 'fssai', placeholder: 'FSSAI Number', label: 'FSSAI Number', type: 'text' },
              { name: 'mfgdate', placeholder: 'Manufacture Date', label: 'MFG Date', type: 'date' }
            ].map(({ name, placeholder, label, type }) => (
              <motion.div key={name} variants={inputVariants}>
                <label htmlFor={name} className="block font-medium mb-1 text-gray-800">
                  {label}
                </label>
                <input
                  id={name}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            ))}




            {/* Description textarea */}
            <motion.div variants={inputVariants}>
              <label className="block font-medium mb-1 text-gray-800">
                Description
              </label>
              <motion.textarea
                name="description"
                placeholder="Product Description"
                value={form.description}
                onChange={handleChange}
                variants={inputVariants}
                whileFocus={{ scale: 1.02 }}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div variants={inputVariants}>
              <label className="block font-medium mb-1 text-gray-800">
                Product Images
              </label>
              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="border p-2 w-full rounded-md bg-white text-gray-500">
                  Choose Files
                </div>
              </div>
              {imageNames.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                  {imageNames.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              )}
            </motion.div>

            <div className="h-4" />

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={inputVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
            >
              Add Product
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
