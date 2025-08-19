import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controller/wishlistController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const wishlistrouter = express.Router();

wishlistrouter.post('/add', verifyToken, addToWishlist);
wishlistrouter.get('/get', verifyToken, getWishlist);
wishlistrouter.delete('/remove', verifyToken, removeFromWishlist);

export default wishlistrouter;
