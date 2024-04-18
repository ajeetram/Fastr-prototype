import upiModel from "../models/upiModel.js";


export const createNewUpiHandle = async(req,res)=>{
    try {
        const {upiId} = req.body;

        if(!upiId)
        {
            return res.status(401).send({
                message:"UPI ID required"
            })
        }

        const upi = await new upiModel({upiId}).save();
        res.status(201).send({
            success:true,
            message:"UPI handle saved successfully",
            upi
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in saving new UPI handle",
            error
        })   
    }
} 


export const getAllUpiHandle = async(req,res)=>{
    try {
        const data  = await upiModel.find({});
        res.status(200).send({
            success:true,
            message:"got all UPI handle successfully",
            data
        })
        
    } catch (error) {
        res.status(500).send({
            message:"error while getting all upi handle",
            success:false,
            error
        })
    }
}


export const updateUpiHandle = async(req,res)=>{
    try {
        const {upiId} = req.body;
        const {id} = req.params;
        const updateUpi = await upiModel.findByIdAndUpdate(id,{upiId},{new:true});
        res.status(201).send({
            success:true,
            message:"UPI handle updated successsfully",
            updateUpi
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while updating UPI handle",
            error
        })
    }
}

export const deleteUpiHandle = async(req,res)=>{
    try {
        const {id} = req.params;
        await upiModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"UPI handle Removed Successfully"
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while removing upi Handle",
            error
        })
    }
}