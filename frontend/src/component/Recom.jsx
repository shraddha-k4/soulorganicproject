import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Get_All_Product_Api,
  add_to_wishlist,
  get_to_wishlist,
  remove_to_wishlist,
} from "../api/ApiEndPoints.jsx";
import { FaHeart } from "react-icons/fa";

const Recom = ({ category = null, excludeId = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);
  const [paused, setPaused] = useState(false);

  const scrollRef = useRef(null);
  const controls = useAnimation(); // for framer auto scroll
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRecommended();
    fetchWishlist();
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        products.forEach((prod) => {
          const length = prod.images?.length || 0;
          if (length > 1) {
            const currentIndex = prev[prod._id] || 0;
            updated[prod._id] = (currentIndex + 1) % length;
          }
        });
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [products]);

  // Auto scroll animation
  useEffect(() => {
    if (!paused && products.length > 0) {
      controls.start({
        x: ["0%", "-100%"],
        transition: { repeat: Infinity, duration: 60, ease: "linear" },
      });
    } else {
      controls.stop();
    }
  }, [paused, products, controls]);

  const fetchRecommended = async () => {
    try {
      setLoading(true);
      let url = Get_All_Product_Api;
      if (category) {
        url += `?category=${category}`;
      }
      const res = await axios.get(url);
      let filtered = res.data;

      if (category && excludeId) {
        filtered = filtered
          .filter((p) => p._id !== excludeId)
          .filter((p) => p.category === category);
      }
      if (!category) {
        filtered = filtered.slice(0, 6);
      }

      setProducts(filtered);

      const indexes = {};
      filtered.forEach((p) => {
        indexes[p._id] = 0;
      });
      setImageIndexes(indexes);
    } catch (err) {
      console.error("Error fetching recommended products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(get_to_wishlist, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data.items
        .filter((item) => item?.productId)
        .map((item) => item.productId._id);

      setWishlistIds(ids);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        add_to_wishlist,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        fetchWishlist();
      } else if (res.status === 409) {
        await axios.delete(remove_to_wishlist, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId },
        });
        fetchWishlist();
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading recommendations...</p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-red-500">No recommended products found.</p>
    );
  }

  return (
    <div className="mt-12 px-4">
      <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold mb-6 text-green-700">
        Recommended Products
      </h2>

      <div
        ref={scrollRef}
        className="relative w-full py-4 overflow-x-auto scrollbar-hide"
        onMouseEnter={() => setPaused(true)} // hover → stop auto
        onMouseLeave={() => setPaused(false)} // leave → resume auto
      >
        <motion.div
          className="flex gap-6"
          animate={controls} // controlled animation
        >
          {[...products, ...products].map((prod, index) => {
            const currentIndex = imageIndexes[prod._id] || 0;
            const imageKey = `${prod._id}-${currentIndex}`;
            const currentImage =
              prod.images?.[currentIndex] || "/placeholder.jpg";

            return (
              <motion.div
                key={`${prod._id}-${index}`}
                className="bg-white rounded-lg px-4 py-5 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all relative min-w-[250px]"
                onClick={() => navigate(`/product/${prod._id}`)}
              >
                {/* Wishlist Icon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(prod._id);
                  }}
                  className="absolute top-2 right-2 text-xl sm:text-2xl p-1 cursor-pointer"
                >
                  <FaHeart
                    className={`stroke-black stroke-[20] ${
                      wishlistIds.includes(prod._id)
                        ? "text-red-500 stroke-red-600"
                        : "text-white"
                    }`}
                  />
                </div>

                {/* Product Image */}
                <div className="w-full h-40 sm:h-48 mb-3 flex justify-center items-center overflow-hidden rounded">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imageKey}
                      src={currentImage}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-1 justify-center items-center">
                  <h3 className="text-lg sm:text-xl text-green-600 font-bold text-center">
                    {prod.name}
                  </h3>
                  <p className="text-base sm:text-lg">Rs. {prod.price}</p>
                  <button className="py-1 text-sm sm:text-base rounded text-yellow-400 px-9 sm:px-12 bg-green-600 hover:bg-green-700 cursor-pointer">
                    Buy Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Recom;
