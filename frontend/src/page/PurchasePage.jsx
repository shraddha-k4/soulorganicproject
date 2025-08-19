import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar.jsx';
import { create_order, Get_Single_Product_Api } from '../api/ApiEndPoints.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quantity = new URLSearchParams(location.search).get("quantity") || 1;

  const [product, setProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch product details
  useEffect(() => {
    axios.get(`${Get_Single_Product_Api}/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Handle order creation
  const handleConfirmBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to place an order");
        return;
      }

      const orderData = { productId: id, quantity: Number(quantity) };
      const res = await axios.post(create_order, orderData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.status === 201 || res.status === 200) {
        setOrderSuccess(true);
        setTimeout(() => {
          setOrderSuccess(false);
          navigate("/product");
        }, 3000);
      }
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error.message);
      alert("Failed to create order. Please try again.");
    }
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl text-green-600 font-bold mb-6 text-center sm:text-left">
          Confirm Purchase
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 shadow-xl p-4 rounded-lg">
          {/* Product Image */}
          <div className="flex justify-center sm:justify-start">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full max-w-xs sm:max-w-[240px] h-auto object-contain rounded"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <p className="font-bold text-green-600 text-xl sm:text-2xl">{product.name}</p>
              <p className="text-lg sm:text-xl"><strong>Quantity:</strong> {quantity}</p>
              <p className="font-semibold text-lg sm:text-xl"><strong>Total:</strong> ₹{(product.price * quantity).toFixed(2)}</p>
              <p className="text-lg sm:text-xl"><strong>Payment Method:</strong> Cash on Delivery</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuyNow}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Message */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            className="fixed top-30 right-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-6 py-3 rounded shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <strong>🎉</strong> Order Successful!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchasePage;
