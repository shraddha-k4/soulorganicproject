import axiosInstance from './axiosInstance';
import {
  add_to_wishlist,
  get_to_wishlist,
  remove_to_wishlist,
} from './ApiEndPoints';

// Add to Wishlist
export const addToWishlist = async (productId) => {
  return axiosInstance.post(add_to_wishlist, { productId });
};

// Get Wishlist
export const getWishlist = async () => {
  return axiosInstance.get(get_to_wishlist);
};

// Remove from Wishlist
export const removeFromWishlist = async (productId) => {
  return axiosInstance.delete(remove_to_wishlist, {
    data: { productId },
  });
};
