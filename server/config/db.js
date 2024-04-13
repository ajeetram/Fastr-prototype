import mongoose from 'mongoose'


const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://fastr:fastr123@fastr.zlpfjrx.mongodb.net/?retryWrites=true&w=majority&appName=fastr",{
            useNewUrlParser:true,
        })
        console.log("Connected to mongodb database");
    } catch (error) {
        console.log("error while connecting with mongodb",error);
    }
}

export default connectDB;