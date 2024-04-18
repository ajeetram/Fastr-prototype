import express from "express";
import { createNewUpiHandle, deleteUpiHandle, getAllUpiHandle, updateUpiHandle } from "../controllers/upiControllers.js";

const router = express.Router();

router.post('/createUpiHandle',createNewUpiHandle);

router.get('/AllUpiHandle',getAllUpiHandle);

router.put('/updateUpiHandle/:id',updateUpiHandle);

router.delete('/deleteUpiHandle/:id',deleteUpiHandle);

export default router;