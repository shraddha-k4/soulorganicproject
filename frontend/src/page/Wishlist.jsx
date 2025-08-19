import React, { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../api/wishlistApi.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      const validItems = res.data.items.filter(item => item?.productId);
      setWishlist(validItems);
    } catch (error) {
      toast.error('Failed to fetch wishlist');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-green-600 font-bold mb-6 text-center sm:text-left">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className='text-center sm:text-left text-gray-600'>
            No items in wishlist.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId._id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={item?.productId?.images?.[0] || "/placeholder.jpg"}
                  alt={item?.productId?.name || "Product unavailable"}
                  className="w-full h-40 sm:h-48 md:h-52 object-contain mb-4 rounded cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId._id}`)}
                />
                <h2 className="text-lg sm:text-xl font-semibold text-green-600 mb-1 truncate">
                  {item?.productId?.name || "No name available"}
                </h2>
                <p className="text-gray-700 mb-3">₹{item?.productId?.price || "N/A"}</p>
                <div className="mt-auto flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/product/${item.productId._id}`)}
                    className="text-sm sm:text-base bg-green-600 text-yellow-400 px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    View
                  </button>
                  <FaTrash
                    className="text-red-600 text-xl cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRemove(item.productId._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
