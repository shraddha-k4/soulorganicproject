import React, { useEffect, useState } from "react";
import axios from "axios";
import { get_to_cart, remove_cart, create_order } from "../api/ApiEndPoints.jsx";
import Navbar from "../component/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your cart");
      navigate("/profile");
      return;
    }

    try {
      const res = await axios.get(get_to_cart, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data.cart?.items || [];
      setCartItems(items);
      calculateTotal(items);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cart");
    }
  };

  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(remove_cart(productId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const handleConfirmCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to proceed");
      navigate("/profile");
      return;
    }

    try {
      for (const item of cartItems) {
        const productId = item.productId?._id;
        const quantity = item.quantity;

        if (!productId || !quantity) continue;

        await axios.post(create_order, { productId, quantity }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.delete(remove_cart(productId), {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setOrderSuccess(true);
      setShowConfirm(false);

      setTimeout(() => {
        setOrderSuccess(false);
        navigate("/customer/orders");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* <Navbar /> */}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl text-green-600 font-bold mb-6 text-center sm:text-left">
          My Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.productId?._id} className="flex flex-col sm:flex-row gap-4 shadow-lg p-4 rounded-lg">
                <div className="flex justify-center sm:justify-start">
                  <img
                    src={item.productId?.images?.[0] || "/placeholder.png"}
                    alt={item.productId?.name}
                    className="w-full max-w-xs sm:max-w-[180px] h-auto object-contain rounded"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="font-bold text-green-600 text-xl sm:text-2xl">{item.productId?.name}</p>
                    <p className="text-lg sm:text-xl">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-lg sm:text-xl">
                      Total: ₹{(item.productId?.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-lg sm:text-xl">Payment Method: Cash on Delivery</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => handleRemove(item.productId?._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            
            <div className=" bottom-10 left-0 w-full bg-white  z-40">
             
               <div className="text-right">
                <p className="text-xl font-bold text-green-800">Total: ₹{total}</p>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-11/12 max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Confirm Your Order</h2>
              <p className="text-lg mb-2">Payment Method: <strong>Cash on Delivery</strong></p>
              <p className="text-lg mb-4">Total Amount: ₹{total}</p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            className="fixed top-30 right-5 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            🎉 Order Placed Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
