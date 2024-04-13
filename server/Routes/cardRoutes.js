import express from "express";
import { createNewCardController, deleteCard, getAllCardData, updateCardData } from '../controllers/cardController.js';

const router = express.Router();


router.post('/create-card',createNewCardController);

router.get('/allCardData',getAllCardData);

router.put('/updateCard/:id',updateCardData);

router.delete('/deleteCard/:id',deleteCard);

export default router;