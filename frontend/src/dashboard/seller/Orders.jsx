// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SellerSidebar from "./SellerSidebar.jsx";
// import SellerNavbar from "./SellerNavbar.jsx";
// import { seller_order, updateOrderItemStatusApi } from "../../api/ApiEndPoints.jsx";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSellerOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please login to view your orders");
//         return;
//       }

//       const res = await axios.get(seller_order, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setOrders(res.data || []);
//     } catch (error) {
//       console.error("Error fetching seller orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId, itemId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         updateOrderItemStatusApi(orderId, itemId),
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId
//             ? {
//                 ...order,
//                 items: order.items.map((item) =>
//                   item._id === itemId
//                     ? { ...item, status: newStatus }
//                     : item
//                 ),
//               }
//             : order
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update order item status:", error);
//       alert("Status update failed");
//     }
//   };

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="hidden md:block">
//         <SellerSidebar />
//       </div>
//       <div className="flex-1 p-4 pb-20 md:pb-4">
//         {/* <SellerNavbar /> */}
//         <h2 className="mb-4 text-3xl font-bold text-green-800">Orders</h2>

//         {loading ? (
//           <p className="text-gray-500">Loading orders...</p>
//         ) : orders.length === 0 ? (
//           <p className="text-gray-500">No recent orders.</p>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div key={order._id} className="bg-white shadow rounded-lg p-4">
//                 <div className="mb-2 text-sm text-gray-600">
//                   <p>
//                     <span className="font-semibold">Buyer:</span>{" "}
//                     {order.buyer?.name} ({order.buyer?.email})
//                   </p>
//                   <p>
//                     <span className="font-semibold">Order Date:</span>{" "}
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                   <p>
//                     <span className="font-semibold">Status:</span>{" "}
//                     <span
//                       className={`font-bold ${
//                         order.status === "Delivered"
//                           ? "text-green-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </p>
//                 </div>

//                 {order.items.map((item, idx) => {
//                   const product = item.productId || {};
//                   const imageUrl =
//                     Array.isArray(product.images) && product.images.length > 0
//                       ? product.images[0]
//                       : "/placeholder.png";

//                   return (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-4 border-t pt-4"
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={product.name || "Product"}
//                         className="w-16 h-16 object-contain rounded border"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/placeholder.png";
//                         }}
//                       />
//                       <div>
//                         <p className="font-semibold">
//                           {product.name || "Unnamed Product"}
//                         </p>
//                         <p>Quantity: {item.quantity}</p>
//                         <p>Unit Price: ₹{item.price.toFixed(2)}</p>
//                         <p>Item Total: ₹{item.totalAmount.toFixed(2)}</p>

//                         {/* Item-specific status dropdown */}
//                         <select
//                           value={item.status}
//                           onChange={(e) =>
//                             handleStatusChange(
//                               order._id,
//                               item._id,
//                               e.target.value
//                             )
//                           }
//                           className="mt-2 p-2 border rounded"
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Processing">Processing</option>
//                           <option value="Shipped">Shipped</option>
//                           <option value="Delivered">Delivered</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;


import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerSidebar from "./SellerSidebar.jsx";
import SellerNavbar from "./SellerNavbar.jsx";
import { seller_order, updateOrderItemStatusApi } from "../../api/ApiEndPoints.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your orders");
        return;
      }

      const res = await axios.get(seller_order, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        updateOrderItemStatusApi(orderId, itemId),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId
                    ? { ...item, status: newStatus }
                    : item
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order item status:", error);
      alert("Status update failed");
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>
      <div className="flex-1 p-4 pb-20 md:pb-4">
        {/* <SellerNavbar /> */}
        <h2 className="mb-4 text-3xl font-bold text-green-800">Orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-lg p-4">
                <div className="mb-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Buyer:</span>{" "}
                    {order.buyer?.name} 
                  </p>
                  <p>
                    <span className="font-semibold">Buyer Email:</span>{" "}
                    {order.buyer?.email}
                  </p>
                  {/* <p>
                    <span className="font-semibold">Order Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`font-bold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p> */}
                </div>

                {order.items.map((item, idx) => {
                  const product = item.productId || {};
                  const imageUrl =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.png";
                  const itemDate = item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "N/A";

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-t pt-4"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name || "Product"}
                        className="w-25 h-25 object-contain rounded "
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      <div>
                        <p className="font-semibold">
                          {product.name || "Unnamed Product"}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Unit Price: ₹{item.price.toFixed(2)}</p>
                        <p>Item Total: ₹{item.totalAmount.toFixed(2)}</p>
                        <p>
                          <span className="font-semibold">Item Date:</span>{" "}
                          {itemDate}
                        </p>

                        {/* Item-specific status dropdown */}
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              item._id,
                              e.target.value
                            )
                          }
                          className="mt-2 p-2 border rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;