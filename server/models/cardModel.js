import mongoose from "mongoose";

const cardSchema   = new mongoose.Schema({
    cardName:{
        type:String,
        required:true,
        
    },
    cardNumber:{
        type:Number,
        required:true,
        
    },
    expiryDate:{
        type:String,
        required:true
    },
    cvv:{
        type:Number,
        required:true,
        
    }
})

export default mongoose.model('cardData',cardSchema);