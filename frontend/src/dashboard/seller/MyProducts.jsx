import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Get_Product_Api, Delete_Product_Api } from '../../api/ApiEndPoints.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SellerSidebar from './SellerSidebar.jsx';


const containerVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const tableVariant = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const rowVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [expandedDesc, setExpandedDesc] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [expandedIngredients, setExpandedIngredients] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(Get_Product_Api, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${Delete_Product_Api}/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/seller/editproduct/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div
      className="flex min-h-screen"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="hidden md:block">
        <SellerSidebar />
      </div>

      <div className="flex-1 p-4 overflow-x-auto">
        {/* <SellerNavbar /> */}
        <h2 className="text-3xl font-bold text-green-800">My Products</h2>
        <div className="h-4" />

        {products.length === 0 ? (
          <p className="text-gray-600">No products added yet.</p>
        ) : (
          <motion.table
            variants={tableVariant}
            initial="hidden"
            animate="visible"
            className="min-w-full border border-gray-500 text-sm rounded-lg overflow-hidden shadow-lg table-fixed"
          >
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border border-gray-500">Images</th>
                <th className="p-3 border border-gray-500">Name</th>
                <th className="p-3 border border-gray-500">Brand</th>
                <th className="p-3 border border-gray-500">Price</th>
                <th className="p-3 border border-gray-500">Category</th>
                {/* <th className="p-3 border border-gray-500">Description</th>
                <th className="p-3 border border-gray-500">Ingredients</th>
                <th className="p-3 border border-gray-500">Ideal For</th>
                <th className="p-3 border border-gray-500">Shelf Life</th>
                <th className="p-3 border border-gray-500">Manufacturer</th>
                <th className="p-3 border border-gray-500">FSSAI</th> */}
                <th className="p-3 border border-gray-500">Size</th>
                <th className="p-3 border border-gray-500">MFG Date</th>
                <th className="p-3 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product._id}
                  variants={rowVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="p-3 border border-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {product.images?.length > 0 ? (
                        product.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="h-12 w-12 object-cover rounded border cursor-pointer"
                            onClick={() => setPreviewImg(img)}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">No Images</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-500 font-medium">{product.name}</td>
                  <td className="p-3 border border-gray-500">{product.brand}</td>
                  <td className="p-3 border border-gray-500 text-green-600 font-semibold">₹{product.price}</td>
                  <td className="p-3 border border-gray-500">{product.category}</td>
                  {/* <td className="p-3 border border-gray-500 max-w-xs text-gray-700">
                    {expandedDesc === product._id ? (
                      <>
                        {product.description}{' '}
                        <button
                          onClick={() => setExpandedDesc(null)}
                          className="text-blue-500 underline text-xs"
                        >
                          Read Less
                        </button>
                      </>
                    ) : (
                      <>
                        {product.description?.slice(0, 50)}...
                        {product.description?.length > 50 && (
                          <button
                            onClick={() => setExpandedDesc(product._id)}
                            className="text-blue-500 underline text-xs"
                          >
                            Read More
                          </button>
                        )}
                      </>
                    )}
                  </td>

                  <td className="p-3 border border-gray-500 max-w-xs text-gray-700">
                    {expandedIngredients === product._id ? (
                      <>
                        {product.ingredients}{' '}
                        <button
                          onClick={() => setExpandedIngredients(null)}
                          className="text-blue-500 underline text-xs"
                        >
                          Read Less
                        </button>
                      </>
                    ) : (
                      <>
                        {product.ingredients?.slice(0, 50)}...
                        {product.ingredients?.length > 50 && (
                          <button
                            onClick={() => setExpandedIngredients(product._id)}
                            className="text-blue-500 underline text-xs"
                          >
                            Read More
                          </button>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-3 border border-gray-500">{product.idealFor || '-'}</td>
                  <td className="p-3 border border-gray-500">{product.shelfLife || '-'}</td>
                  <td className="p-3 border border-gray-500">{product.manufacturer || '-'}</td>
                  <td className="p-3 border border-gray-500">{product.fssai || '-'}</td>*/}
                  <td className="p-3 border border-gray-500">{product.size || '-'}</td> 
                
                  <td className="p-3 border border-gray-500">
                    {product.mfgdate
                      ? new Date(product.mfgdate).toLocaleDateString('en-GB') // DD/MM/YYYY format
                      : '-'}
                  </td>

                  <td className="p-3 border border-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImg && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariant}
            >
              <div className="relative bg-white p-4 rounded shadow-xl max-w-3xl max-h-[90vh] overflow-auto">
                <img src={previewImg} alt="Preview" className="max-w-full max-h-[80vh] rounded" />
                <button
                  onClick={() => setPreviewImg(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1 text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyProducts;




