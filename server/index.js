import express from 'express'
import connectDB from './config/db.js';
import cors from 'cors';
import cardRoutes from './Routes/cardRoutes.js';
import upiRoutes from './Routes/upiRoutes.js';

// database config
connectDB();
const PORT = 3032
const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1/card",cardRoutes);
app.use("/api/v1/upi",upiRoutes)
app.get('/',(req,res)=>{
    res.send('Hello world !');
})

app.listen(PORT,()=>{
    console.log(`server is running on  ${PORT} `)
})

