import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Auth_profile_Api, get_to_cart, get_to_wishlist, my_order } from '../../api/ApiEndPoints.jsx';
import { getUser } from '../../utils/auth.js';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../../page/Footer.jsx';
import profile from '../../assets/images/profile (2).jpeg';
import cart from '../../assets/images/cart.jpeg';
import order from '../../assets/images/order.jpeg';
import address1 from '../../assets/images/address.jpeg';
import wish from '../../assets/images/wish.jpeg';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const CustomerDashboard = () => {
  const user = getUser();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  // ✅ Add state for address
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(get_to_cart, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data.cart?.items || [];
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      } catch (error) {
        console.error("Error fetching cart count", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(get_to_wishlist, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data.items || [];
        const validItems = items.filter(item => item?.productId);
        setWishlistCount(validItems.length);
      } catch (error) {
        console.error("Error fetching wishlist count", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get(my_order, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = Array.isArray(res.data) ? res.data : [];
        const itemCount = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
        setOrdersCount(itemCount);
      } catch (error) {
        console.error("Error fetching orders count", error);
      }
    };

    const fetchAddress = async () => {
      try {
        const res = await axios.get(Auth_profile_Api, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.user;
        setAddress(userData?.address || 'No address added');
      } catch (error) {
        console.error("Error fetching user address", error);
      }
    };

    fetchCart();
    fetchWishlist();
    fetchOrders();
    fetchAddress();
  }, []);

  // Add this helper function
  const formatAddress = (addr) => {
    if (!addr) return 'No address added';
    return `${addr.city || ''}, ${addr.dist || ''}, ${addr.state || ''}, ${addr.pincode || ''}, ${addr.country || ''}`;
  };


  return (
    <>
      <div className="min-h-screen flex flex-col  bg-green-100/70">
        <div className="flex flex-1">
          <main className="flex-1 p-6 ">
            <motion.div
              className="max-w-6xl mx-auto space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 bg-clip-text text-transparent">
                Welcome, {user?.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                
                <Link to='/customer/profile'>
                  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-xl">
                    {/* Image and Heading in one line */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={profile || '/defaultProfile.png'}
                        alt="profile"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <h2 className="text-xl font-semibold">My Profile</h2>
                    </div>

                    {/* User details */}
                    <p><span className="font-semibold">Name:</span> {user?.name}</p>
                    <p><span className="font-semibold">Email:</span> {user?.email}</p>
                 
                  </div>
                </Link>


                {/* Cart Card */}
                <Link to='/cart'>
                  <div className="bg-white px-4 py-7 rounded-2xl shadow hover:shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={cart || '/defaultProfile.png'}
                        alt="cart"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <h2 className="text-xl font-semibold">My Cart</h2>
                    </div>
                    <p>
                      You have {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart.
                    </p>
                  </div>
                </Link>

                {/* Wishlist Card */}
                <Link to='/wishlist'>
                  <div className="bg-white px-4 py-7 rounded-2xl shadow hover:shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={wish || '/defaultProfile.png'}
                        alt="cart"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <h2 className="text-xl font-semibold">My Wishlist</h2>
                    </div>
                    <p>
                      You have {wishlistCount} item{wishlistCount !== 1 ? "s" : ""} in your wishlist.
                    </p>
                  </div>
                </Link>

                {/* Orders Card */}
                <Link to='/customer/orders'>
                  <div className="bg-white px-4 py-7 rounded-2xl shadow hover:shadow-xl ">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={order || '/defaultProfile.png'}
                        alt="order"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <h2 className="text-xl font-semibold">My Order</h2>
                    </div>
                    <p>
                      You have {ordersCount} item{ordersCount !== 1 ? "s" : ""} in your order.
                    </p>
                  </div>
                </Link>

                {/* Address Card */}
                <Link to='/address'>
                  <div className="bg-white px-4 py-7 rounded-2xl shadow hover:shadow-xl ">
                  <div className="flex items-center gap-4 mb-4">
                      <img
                        src={address1 || '/defaultProfile.png'}
                        alt="address"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <h2 className="text-xl font-semibold">My Address</h2>
                    </div>
                    <p>{formatAddress(address)}</p>

                  </div>
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerDashboard;
