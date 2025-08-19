
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar.jsx';
import {  Get_Single_Product_Api, add_to_cart, add_to_wishlist, get_to_wishlist, remove_to_wishlist } from '../api/ApiEndPoints.jsx';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Counter from '../component/Counter.jsx';
import Footer from './Footer.jsx';
import Loading from '../component/Loading.jsx';
import Recom from '../component/Recom.jsx';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading,setLoading]=useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
    fetchWishlist();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Get_Single_Product_Api}/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false);
    }
  };

  
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(get_to_wishlist, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Safely filter out null productId entries
      const ids = res.data.items
        .filter(item => item.productId && item.productId._id)
        .map(item => item.productId._id);

      setWishlistIds(ids);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };


  const handleWishlistToggle = async () => {
    if (!token) {
      alert('Please login first');
      navigate('/profile');
      return;
    }

    try {
      if (wishlistIds.includes(product._id)) {
        // Already in wishlist → remove
        await axios.delete(remove_to_wishlist, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId: product._id },
        });
      } else {
        // Not in wishlist → add
        await axios.post(
          add_to_wishlist,
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchWishlist(); // Refresh local state
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        product?.images ? (prevIndex + 1) % product.images.length : 0
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [product]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        add_to_cart,
        { productId: product._id, quantity: Number(quantity) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if(loading) return <Loading/>;

  return (
    <>
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div onClick={() => navigate(-1)} className="text-black text-2xl cursor-pointer mb-4">
          <FaArrowLeft />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="md:w-1/2 relative">
            <motion.img
              key={currentImageIndex}
              src={product.images?.[currentImageIndex]}
              alt="product"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[400px] object-contain rounded cursor-pointer"
            />

            {/* Wishlist Icon */}
            <FaHeart
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 text-2xl cursor-pointer stroke-black stroke-[20] ${wishlistIds.includes(product._id) ? 'text-red-500 stroke-red-600' : 'text-white'
                }`}
            />

            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumb"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${currentImageIndex === idx ? 'border-blue-500' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 space-y-4 flex flex-col justify-center">
            <h1 className="text-3xl text-green-600 font-bold">{product.name}</h1>
            <span className='flex flex-row gap-2'>
              <p className="text-xl font-semibold">₹{product.price}</p>
              <p className='text-sm'>(Inc. of all taxes)</p>
            </span>
            <p><strong>Size:</strong> {product.size}</p>
            <Counter quantity={quantity} setQuantity={setQuantity} />
            <button onClick={handleAddToCart} className="py-2 px-8 rounded cursor-pointer bg-green-600 hover:bg-green-700 text-yellow-400">Add To Cart</button>
            {/* <button className="py-2 px-11 rounded bg-green-600 hover:bg-green-700 cursor-pointer text-yellow-400">Buy Now</button> */}
            <button
              onClick={() => navigate(`/purchase/${product._id}?quantity=${quantity}`)}
              className="py-2 px-11 rounded bg-green-600 hover:bg-green-700 cursor-pointer text-yellow-400"
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-green-700">Product Info</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-2 border-green-600 rounded border-collapse">
              <tbody>
                <tr><th className="p-3 text-orange-500 text-xl w-1/3 border-2 border-green-600">Brand</th><td className="p-3 border-2 border-green-600">{product.brand}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl w-1/3 border-2 border-green-600">MFG Date</th><td className="p-3 border-2 border-green-600">{product.mfgdate ? new Date(product.mfgdate).toLocaleDateString('en-GB',{
                  day:'2-digit',month:'2-digit',year:'numeric'}) : ''}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">Shelf Life</th><td className="p-3 border-2 border-green-600">{product.shelfLife}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">Ingredients</th><td className="p-3 border-2 border-green-600">{product.ingredients}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">Description</th><td className="p-3 border-2 border-green-600">{product.description}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">Ideal For Making</th><td className="p-3 border-2 border-green-600">{product.idealFor}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">Marketed & Manufactured By</th><td className="p-3 border-2 border-green-600">{product.manufacturer}</td></tr>
                <tr><th className="p-3 text-orange-500 text-xl border-2 border-green-600">FSSAI Number</th><td className="p-3 border-2 border-green-600">{product.fssai}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={product.images?.[currentImageIndex]}
              alt="Full view"
              className="max-w-4xl max-h-[90vh] object-contain rounded"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <Recom category={product.category} excludeId={product._id} />
    <Footer/>
    </>
  );
};

export default SingleProduct;





