import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../middleware/authMiddleware.js';
import User from '../dataLayer/accountModel.js';

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
   const { businessName, firstName, lastName, email, password, userId } =
      req.body;

   if (!businessName || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
   }

//    let userInfo = {
//       userId: uuidv4(),
//       firstName,
//       lastName,
//       email,
//       password,
//       businessName,
//    };

   const userExist = await User.findOne({email});
    

   console.log(userExist);

   if (userExist) {
    res.status(400)
    throw new Error('User Account Exist')
   } 
   else {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

   const userInfo = await User.create(
    {
        userID: uuidv4(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        businessName,
     }
   )

  if (userInfo) {
    res.status(201).json({
        email: userInfo.email,
        message: 'Success',
        userId: userInfo.userID,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        businessName: userInfo.businessName,
        token: generateToken(userInfo._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user Data')
  }
} 

});



const loginUser = asyncHandler(async(req,res) => {
    const {  email, password } = req.body
      

    if (!email || !password) {
        res.status(400)
        throw new Error('email and password is required')
    }

    const activeUser = await User.findOne({email})


    if (activeUser && ( await bcrypt.compare(password, activeUser?.password)))  {
        res.json({
            _id: activeUser._id,
            firstName: activeUser.firstName,
            lastName: activeUser.lastName,
            businessName: activeUser.businessName,
            email:activeUser.email,
            token: generateToken(activeUser._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }

     
})




const getLoginUser = asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
})

 
export { 
    registerUser,
    loginUser,
    getLoginUser
};
