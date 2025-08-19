import React, { useEffect, useState } from "react";
import axios from "axios";
import { my_order, Auth_profile_Api, removeOrderItemApi } from "../../api/ApiEndPoints.jsx";
import { Link } from "react-router-dom";
import SellerSidebar from "../seller/SellerSidebar.jsx";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

const CusOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login to view your orders");
          return;
        }

        const userRes = await axios.get(Auth_profile_Api, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userRes.data?.user;
        setRole(userData?.role || "customer");

        const orderRes = await axios.get(my_order, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = orderRes.data;

        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && data.items) {
          setOrders([data]);
        } else {
          console.warn("Unexpected order format:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching user or orders:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  const handleCancelItem = async (orderId, itemId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this item?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(removeOrderItemApi(orderId, itemId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Item cancelled successfully");

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? {
              ...order,
              items: order.items.filter(item => item._id !== itemId),
            }
            : order
        )
      );
    } catch (error) {
      console.error("Cancel item error:", error.response?.data || error.message);
      alert("Failed to cancel item");
    }
  };

  if (loading || role === null) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading your orders...</div>;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">


      <div className="flex flex-1 flex-col sm:flex-row">
        <div className="hidden sm:block sm:w-64">
          {role === "seller" && <SellerSidebar />}
        </div>

        <div className="flex-1 p-4 sm:p-6">
          <h2 className="font-bold text-3xl text-green-800 mb-4 sm:text-left">My Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center sm:text-left">
              You have not placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="space-y-6">
                  {order.items.map((item, idx) => {
                    const product = item.productId || {};
                    const imageUrl = product.images?.[0]?.trim();
                    const unitPrice = Number(product.price) || 0;
                    const itemTotal = Number(item.total) || unitPrice * item.quantity;
                    const itemStatus = item.status || order.status;
                    const orderDate = new Date(order.createdAt).toLocaleDateString();
                    const itemDate = item.date ? new Date(item.date).toLocaleDateString() : orderDate;
                    const currentStepIndex = steps.indexOf(itemStatus);

                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-1 shadow-xl p-4 sm:p-6 rounded-lg"
                      >
                        {/* Product Info */}
                        <div className="flex flex-col sm:flex-row justify-between  sm:items-start ">
                          <Link
                            to={`/product/${product._id}`}
                            className="flex flex-col sm:flex-row  text-left gap-4 w-full hover:opacity-80 transition"
                          >
                            <img
                              src={imageUrl || "/placeholder.png"}
                              alt={product.name || "Product"}
                              className="w-30 h-30 object-contain rounded mx-auto sm:mx-0"
                            />
                            <div className="flex flex-col  sm:text-left">
                              <p className="font-semibold text-base sm:text-lg">
                                {product.name || "Unnamed Product"}
                              </p>
                              <p className="text-sm">Quantity: {item.quantity}</p>
                              <p className="text-sm">Unit Price: ₹{unitPrice.toFixed(2)}</p>
                            </div>
                          </Link>

                          <div className="text-left sm:text-right min-w-[150px] space-y-1">
                            <p className="font-semibold text-base">
                              Item Total: ₹{itemTotal.toFixed(2)}
                            </p>
                            <p
                              className={`text-sm font-bold ${itemStatus === "Delivered"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                                }`}
                            >Status:
                              {itemStatus}
                            </p>
                            <p className="text-sm text-gray-500">Date: {itemDate}</p>
                          </div>
                        </div>

                        {/* Order Tracking */}
                        <div className="bg-white p-6 rounded-xl w-full max-w-3xl mx-auto">
                          <h2 className="text-lg font-bold mb-6">Order Tracking</h2>

                          <div className="relative flex items-center justify-between mt-4 w-full">
                            <div className="absolute top-4 left-0 w-45 ml-10 md:w-140 md:ml-19 h-1 bg-gray-300 z-0"></div>

                            <div
                              className="absolute top-4 left-0 h-1 w-60 ml-10 md:w-140 md:ml-19 bg-green-500 z-0"
                              style={{
                                width: `${(currentStepIndex / (steps.length - 1)) * 75}%`,
                              }}
                            ></div>

                            {steps.map((step, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center flex-1 relative z-10"
                              >
                                <div
                                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold
                                    ${index <= currentStepIndex
                                      ? "bg-green-500 text-white border-green-500"
                                      : "bg-gray-200 text-gray-600 border-gray-300"
                                    }`}
                                >
                                  {index + 1}
                                </div>
                                <span
                                  className={`mt-2 text-xs sm:text-sm text-center ${index <= currentStepIndex
                                      ? "text-green-600"
                                      : "text-gray-500"
                                    }`}
                                >
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cancel Button at Bottom */}
                        {itemStatus !== "Delivered" && (
                          <div className="w-full mt-4 text-left sm:text-right">
                            <button
                              onClick={() => handleCancelItem(order._id, item._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CusOrder;