import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import route from './src/route/AuthRoute.js';
import addproductRouter from './src/route/addproductRoutes.js';
import cartRoute from './src/route/cartRoute.js';
import wishlistrouter from './src/route/wishlistRoute.js';
import orderrouter from './src/route/OrderRoute.js';



dotenv.config();

const app= express();
app.use(cors());
app.use(express.json());

//  Serve uploaded images
app.use('/uploads', express.static('uploads'));

//connect mongodb
connectDB();

//call  route
app.use('/api/v4/auth',route);

//call addproductRoute
app.use('/api/v4',addproductRouter);

//call cartroute
app.use('/api/cart',cartRoute);

//call wishlistRoute
app.use('/api/wishlist',wishlistrouter);

//call orderRoute
app.use('/api/order',orderrouter)

app.get('/',(req,res)=>{
    res.send("hello");
})

const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})