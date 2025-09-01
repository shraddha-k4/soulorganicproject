import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SellerSidebar from './SellerSidebar.jsx';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSellerSummary, seller_order } from '../../api/ApiEndPoints.jsx';
import { Button } from './ui/Button.jsx';
import OrderTrend from './OrderTrend.jsx';

// Animation
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const SellerDashboard = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [summaryRes, ordersRes] = await Promise.all([
          axios.get(getSellerSummary, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(seller_order, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setSummary(summaryRes.data);
        setOrders(ordersRes.data || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.data || error.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, []);

  // const today = new Date().toDateString();
  // const todaysOrders = orders.filter(
  //   (order) => new Date(order.createdAt).toDateString() === today
  // );

  const allItems = orders.flatMap(order => order.items);
  const pendingOrders = allItems.filter((item) => item.status === "Pending");
  const processingOrders = allItems.filter((item) => item.status === "Processing");
  const shippedOrders = allItems.filter((item) => item.status === "Shipped");
  const deliveredOrders = allItems.filter((item) => item.status === "Delivered");
  const cancelledOrders = allItems.filter((item) => item.status === "Cancelled");

  return (
    <div className="flex min-h-screen  bg-white">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-[600px] sm:min-w-[700px] lg:min-w-[900px]">
        <motion.div
          className="p-4 md:p-6 flex-1 overflow-y-auto pb-24 md:pb-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-green-800">Seller Dashboard</h1>
            <Link to='/seller/add-product'>
              <Button className="flex gap-2 items-center px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-green-700">
                <PlusCircle size={18} />
                Add Product
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-6 mb-10">
            {[
              { label: "Total Products", value: summary.totalProducts },
              { label: "Total Orders", value: summary.totalOrders },
              { label: "Total Earnings", value: `₹${summary.totalEarnings}`, textColor: "text-green-600" },
              //{ label: "Orders Today", value: todaysOrders.length },
              { label: "Pending", value: pendingOrders.length },
              { label: "Processing", value: processingOrders.length },
              { label: "Shipped", value: shippedOrders.length },
              { label: "Delivered", value: deliveredOrders.length },
              { label: "Cancelled", value: cancelledOrders.length },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div className="rounded-2xl shadow-md hover:shadow-[inset_0_0_20px_rgba(34,197,94,0.8)] p-4 transition-transform duration-300 transform hover:-translate-y-1">
                  <h2 className="text-lg md:text-lg lg:text-sm text-gray-500 mb-2">{item.label}</h2>
                  <p className={`text-2xl md:text-3xl lg:text-3xl font-semibold ${item.textColor || ""}`}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ✅ Order Trend component फक्त */}
          <OrderTrend />


          <motion.div
            className="bg-white rounded-2xl shadow-md p-6"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-green-700 font-semibold mb-4 text-2xl">Orders</h3>

            {loadingOrders ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100">
                <table className="min-w-[900px] w-full text-lg whitespace-nowrap border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-black">
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-left">Quantity</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) =>
                      order.items.map((item, idx) => {
                        const product = item.productId || {};
                        return (
                          <tr
                            key={`${order._id}-${idx}`}
                            className="hover:bg-green-50 transition-colors duration-200"
                          >
                            <td className="py-3 px-4">{order._id}</td>
                            <td className="px-4">{product.name || "Unnamed Product"}</td>
                            <td className="px-4">{item.quantity}</td>
                            <td className="px-4">₹{item.totalAmount.toFixed(2)}</td>
                            <td className="px-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium 
                        ${item.status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${item.status.toLowerCase() === "processing" ? "bg-blue-100 text-blue-700" : ""}
                        ${item.status.toLowerCase() === "shipped" ? "bg-indigo-100 text-indigo-700" : ""}
                        ${item.status.toLowerCase() === "delivered" ? "bg-green-100 text-green-700" : ""}
                        ${item.status.toLowerCase() === "cancelled" ? "bg-red-100 text-red-700" : ""}`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
};

export default SellerDashboard;
