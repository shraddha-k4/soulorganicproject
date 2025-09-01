import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBoxOpen, FaPlus, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Auth_profile_Api } from "../../api/ApiEndPoints.jsx";
import { FaLocationDot } from "react-icons/fa6";

const SellerNavbar = () => {
  const location = useLocation();
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(Auth_profile_Api, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user || {};
        setUser({
          name: userData.name || "Profile",
          email: userData.email || "View and edit your profile",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const links = [
    {
      to: "/seller/profile/user",
      label: user.name,
      subtext: user.email,
      icon: <FaUserCircle className="text-8xl" />,
    },
    {
      to: "/seller/dashboard",
      label: "Dashboard",
      subtext: "Overview of your sales",
      icon: <FaBoxOpen />,
    },
    {
      to: "/seller/add-product",
      label: "Add Product",
      subtext: "Add new items for sale",
      icon: <FaPlus />,
    },
    {
      to: "/seller/my-products",
      label: "My Products",
      subtext: "Manage your listings",
      icon: <FaBoxOpen />,
    },
    {
      to: "/seller/orders",
      label: "Orders",
      subtext: "Customer order details",
      icon: <FaShoppingBag />,
    },
    {
      to: "/customer/orders",
      label: "My Orders",
      subtext: "View your purchases",
      icon: <FaShoppingBag />,
    },
    {
      to: "/address",
      label: "My Address",
      subtext: "View your address",
      icon: <FaLocationDot />,
    },
  ];

    return (
  <div className="sm:hidden min-h-screen bg-white flex flex-col pb-20">
    <nav className="bg-white flex-1 space-y-5 overflow-y-auto">
      {links.map(({ to, label, subtext, icon }) => (
        <Link
          key={to}
          to={to}
          className={`flex items-center p-4 hover:bg-gray-50 shadow-sm ${
            location.pathname === to ? "bg-gray-100" : ""
          }`}
        >
          <div className="text-xl text-gray-600">{icon}</div>
          <div className="ml-4">
            <p className="text-base font-medium">{label}</p>
            <p className="text-sm text-gray-500">{subtext}</p>
          </div>
        </Link>
      ))}
    </nav>

    {/* Logout button */}
    <div className="p-3 mt-auto">
      <button
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/profile";
        }}
      >
        Logout
      </button>
    </div>
  </div>
);

};

export default SellerNavbar;
