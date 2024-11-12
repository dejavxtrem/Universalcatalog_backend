import express from 'express';
const punchOutReceiverRouter = express.Router();

import {
    receivePunchOutSetupRequest,
   
} from '../controllers/punchOutController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

punchOutReceiverRouter.post('/setup', receivePunchOutSetupRequest);




export default punchOutReceiverRouter;
