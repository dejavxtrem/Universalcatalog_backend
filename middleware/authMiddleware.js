import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../dataLayer/accountModel.js';

const generateToken = (userId) => {
   if (!userId) {
      return null;
   }
   return jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: '30d',
   });
};

const verifyToken = asyncHandler(async (req, res, next) => {
   let token;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      try {
         token = req.headers.authorization.split(' ')[1];

         const decoded = jwt.verify(token, process.env.SECRET);

         // console.log(`this is the user details ${JSON.stringify(decoded)}`)

         req.user = await User.findById(decoded.userId).select('-password');

         // console.log(`this is the user details ${JSON.stringify(req.user)}`)
         next();
      } catch (error) {
         console.log(error);
         res.status(401);
         throw new Error('Not authorized');
      }
   }

   if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
   }
});

export { generateToken, verifyToken };
