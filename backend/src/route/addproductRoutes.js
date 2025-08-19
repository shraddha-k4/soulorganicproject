import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getMyProducts, getSellerSummary, getSingleProduct, updateProduct } from '../controller/productController.js';
import upload from '../middleware/multerMiddleware.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';
// import { authorizeRoles, verifyToken } from '';


const addproductRouter = express.Router();

addproductRouter.post('/addproduct',verifyToken,authorizeRoles("seller"), upload.array('images'), addProduct);

addproductRouter.get('/myproducts',verifyToken,getMyProducts);

addproductRouter.get('/allproducts',getAllProducts);

addproductRouter.delete('/deleteproduct/:id', verifyToken, deleteProduct);

addproductRouter.get('/product/:id', getSingleProduct);

addproductRouter.put('/updateproduct/:id',upload.array('images'), verifyToken, updateProduct);

addproductRouter.get('/getSellerSummary',verifyToken,getSellerSummary);

export default addproductRouter;


