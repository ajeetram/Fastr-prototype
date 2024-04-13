import cardModel from "../models/cardModel.js";


export const createNewCardController = async(req,res)=>{
    try {
        const {cardName,cardNumber,expiryDate,cvv} = req.body;

        if(!cardName)
        {
            return res.status(401).send({
                message:"Name on card required"
            })
        }
        if(!cardName || !cardNumber || !expiryDate || !cvv)
        {
            return res.status(401).send({
                message:"Name on card required"
            })
        }
        if(!cardNumber)
        {
            return res.status(401).send({
                message:"Card Number required"
            })
        }
        if(!expiryDate)
        {
            return res.status(401).send({
                message:"expiry date requires"
            })
        }
        if(!cvv)
        {
            return res.status(401).send({
                message:"card cvv required"
            })
        }

        const card = await new cardModel({cardName,cardNumber,expiryDate,cvv}).save();
        res.status(201).send({
            success:true,
            message:"card saved successfully",
            card
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in creating new card",
            error
        })   
    }
} 


export const getAllCardData = async(req,res)=>{
    try {
        const data  = await cardModel.find({});
        res.status(200).send({
            success:true,
            message:"got all card data successfully",
            data
        })
        
    } catch (error) {
        res.status(500).send({
            message:"error while getting all card data",
            success:false,
            error
        })
    }
}


export const updateCardData = async(req,res)=>{
    try {
        const {cardName,cardNumber,expiryDate,cvv} = req.body;
        const {id} = req.params;
        const updateCard = await cardModel.findByIdAndUpdate(id,{cardName,cardNumber,expiryDate,cvv},{new:true});
        res.status(201).send({
            success:true,
            message:"card details updated successsfully",
            updateCard
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while updating card details",
            error
        })
    }
}

export const deleteCard = async(req,res)=>{
    try {
        const {id} = req.params;
        await cardModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Card Removed Successfully"
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while card removing...",
            error
        })
    }
}