// routes/orderRoutes.js
import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createOrder, getMyOrders,  getSellerOrders,  removeOrderItem, updateOrderItemStatus, } from "../controller/OrderController.js";

const orderrouter = express.Router();

// Create a new order
orderrouter.post("/createorder", verifyToken, createOrder);

// Get logged-in user's orders
orderrouter.get("/myorder", verifyToken, getMyOrders);

// orderrouter.get("/sellerorders", verifyToken, getSellerOrders);
orderrouter.get('/sellerorders',verifyToken,getSellerOrders);

orderrouter.put("/:orderId/item/:itemId/status", verifyToken, updateOrderItemStatus);

orderrouter.delete("/:orderId/item/:itemId",verifyToken,removeOrderItem);

export default orderrouter;


