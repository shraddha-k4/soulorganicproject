import express from 'express';
import {  getProfile, login, protectedRoute, signup, updateProfile } from '../controller/AuthController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import upload from '../middleware/multerMiddleware.js';



const route=express.Router();

// route.post('/signup',signup);
route.post("/signup", upload.single("image"), signup);
route.post('/login',login);
route.get('/protected',verifyToken,protectedRoute);
route.get('/profile',verifyToken,getProfile);
route.put('/update/profile',verifyToken,upload.any(),updateProfile);
//route.post("/forgot-password", forgotPassword);


export default route;