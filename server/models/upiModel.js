import mongoose from "mongoose";


const upiSchema = new mongoose.Schema({
    upiId:{
        type:String,
        required:true
    }
})

export default mongoose.model('upiData',upiSchema);