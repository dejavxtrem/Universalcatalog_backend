import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const createOrderRequestRouter = express.Router();

import  {createOrderRequest , getConfirmedOrderbyId , submitCartPoomMessage } from '../controllers/placeOrderController.js';


createOrderRequestRouter.post('/createOrderRequest', verifyToken, createOrderRequest);

createOrderRequestRouter.get('/getConfirmedOrderbyId/:id', verifyToken, getConfirmedOrderbyId);


createOrderRequestRouter.post('/submitPoomMessage' , verifyToken , submitCartPoomMessage)



export default createOrderRequestRouter;