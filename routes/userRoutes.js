import express from 'express';
const userRouter = express.Router();

import {
   registerUser,
   loginUser,
   getLoginUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/home', verifyToken, getLoginUser);

export default userRouter;
