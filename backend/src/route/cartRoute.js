import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { addToCart, getCart, getSellerCartSummary, removeFromCart } from '../controller/cartController.js';

 const cartRoute= express.Router();

 cartRoute.post('/add',verifyToken,addToCart);
 cartRoute.get('/get',verifyToken,getCart);
 cartRoute.delete('/remove/:productId',verifyToken,removeFromCart);
 cartRoute.get('/cartsummary',verifyToken,getSellerCartSummary);

 export default cartRoute;