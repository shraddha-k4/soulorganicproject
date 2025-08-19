import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateProduct_Api, Get_Single_Product_Api } from '../../api/ApiEndPoints.jsx';
import { motion } from 'framer-motion';
import SellerSidebar from './SellerSidebar.jsx';
import SellerNavbar from './SellerNavbar.jsx';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
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
  });

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${Get_Single_Product_Api}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProduct(res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${updateProduct_Api}/${id}`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/seller/my-products');
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>

      <div className="flex-1 p-4">
        <SellerNavbar />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200 left-0 right-0"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Edit Product</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* {[
              { name: 'name', label: 'Product Name' },
              { name: 'brand', label: 'Brand' },
              { name: 'price', label: 'Price (₹)' },
              { name: 'size', label: 'Size (e.g. 1kg)' },
              { name: 'description', label: 'Description' },
              { name: 'ingredients', label: 'Ingredients' },
              { name: 'idealFor', label: 'Ideal For' },
              { name: 'shelfLife', label: 'Shelf Life' },
              { name: 'manufacturer', label: 'Manufacturer' },
              { name: 'fssai', label: 'FSSAI Number' },
              { name: 'mfgdate', label: 'Manufacture Date' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={product[name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))} */}

            {[
              { name: 'name', label: 'Product Name', type: 'text' },
              { name: 'brand', label: 'Brand', type: 'text' },
              { name: 'price', label: 'Price (₹)', type: 'number' },
              { name: 'size', label: 'Size (e.g. 1kg)', type: 'text' },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'ingredients', label: 'Ingredients', type: 'text' },
              { name: 'idealFor', label: 'Ideal For', type: 'text' },
              { name: 'shelfLife', label: 'Shelf Life', type: 'text' },
              { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
              { name: 'fssai', label: 'FSSAI Number', type: 'text' },
              { name: 'mfgdate', label: 'Manufacture Date', type: 'date' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={
                    name === 'mfgdate' && product[name]
                      ? new Date(product[name]).toISOString().split('T')[0] // ensures YYYY-MM-DD
                      : product[name]
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}


            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Update Product
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProduct;
