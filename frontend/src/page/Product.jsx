import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Get_All_Product_Api,
  add_to_wishlist,
  get_to_wishlist,
  remove_to_wishlist
} from '../api/ApiEndPoints.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../component/Navbar.jsx';
import Footer from './Footer.jsx';
import { FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../component/Loading.jsx';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // <-- loading state

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true); // start loading
      const res = await axios.get(Get_All_Product_Api);
      setProducts(res.data);

      const indexes = {};
      res.data.forEach(product => {
        indexes[product._id] = 0;
      });
      setImageIndexes(indexes);

      const uniqueCategories = [
        ...new Set(res.data.map(p => p.category).filter(Boolean))
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // stop loading after fetch
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(get_to_wishlist, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ids = res.data.items
        .filter(item => item?.productId)
        .map(item => item.productId._id);

      setWishlistIds(ids);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
      const res = await axios.post(
        add_to_wishlist,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
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
      console.error('Wishlist toggle error:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(prev => {
        const updated = { ...prev };
        products.forEach(product => {
          const length = product.images?.length || 0;
          if (length > 1) {
            const currentIndex = prev[product._id] || 0;
            updated[product._id] = (currentIndex + 1) % length;
          }
        });
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show loader if loading
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-white min-h-screen">
        <Navbar />

        {/* Category Tabs */}
        <div className="flex gap-3 justify-start overflow-x-auto px-4 mt-6 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer border text-sm sm:text-base ${
              selectedCategory === "All" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer border text-sm sm:text-base ${
                selectedCategory === cat ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product, index) => {
            const currentImageIndex = imageIndexes[product._id] || 0;
            const imageKey = `${product._id}-${currentImageIndex}`;
            const currentImage =
              product.images?.[currentImageIndex] || '/placeholder.jpg';

            return (
              <motion.div
                key={product._id}
                className="bg-white rounded-lg px-3 py-5 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all relative"
                onClick={() => navigate(`/product/${product._id}`)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Wishlist Icon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product._id);
                  }}
                  className="absolute top-2 right-2 text-xl sm:text-2xl p-1 cursor-pointer"
                >
                  <FaHeart
                    className={`stroke-black stroke-[20] ${
                      wishlistIds.includes(product._id)
                        ? 'text-red-500 stroke-red-600'
                        : 'text-white'
                    }`}
                  />
                </div>

                <div className="w-full h-40 sm:h-48 mb-3 flex justify-center items-center overflow-hidden rounded">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imageKey}
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </AnimatePresence>
                </div>

                <div className="flex flex-col space-y-1 justify-center items-center">
                  <h2 className="text-lg sm:text-xl text-green-600 font-bold text-center">
                    {product.name}
                  </h2>
                  <p className="text-base sm:text-lg">Rs. {product.price}</p>
                  <button className="py-1 text-sm sm:text-base rounded text-yellow-400 px-9 sm:px-12 bg-green-600 hover:bg-green-700 cursor-pointer">
                    Buy Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
