import express from 'express';
import asyncHandler from 'express-async-handler';
import multerS3 from 'multer-s3';
import multer from 'multer';
import {
   ListBucketsCommand,
   PutObjectCommand,
   S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
const s3UploadRouter = express.Router();
import User from '../dataLayer/accountModel.js';

import { verifyToken } from '../middleware/authMiddleware.js';
import { getPresignedUrl } from '../controllers/s3UserCatalog.js';

const credentials = {
   region: process.env.REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
};

const initiates3Client = new S3Client(credentials);

const upload = multer({
   storage: multerS3({
      s3: initiates3Client,
      bucket: process.env.CATALOG_UPLOAD_S3_BUCKET,
      metadata: function (req, file, cb) {
         cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
         cb(
            null,
            `uploads/${req.user.businessName}/${
               file.fieldname
            }_${uuidv4()}.csv`,
         );
      },
   }),
});

s3UploadRouter.post(
   '/upload',
   verifyToken,
   upload.single('catalog'),
   async function (req, res, next) {
      const user = req.user._id;
      const filePath = req.file;
      console.log(req.body);
      const newArray = [];
      const getUserInfo = await User.findOne({ _id: user });
      const newFile = {
         bucketUrl: filePath.location,
         ExpiryDate: req.body.ExpiryDate,
      };

      //  filePath.forEach((pathName) => {
      //         newArray.push({
      //             bucketUrl: pathName.location,
      //             ExpiryDate: req.body.ExpiryDate
      //         })
      //  })

      console.log(newFile);

      try {
         const newAccountDetails = await User.findByIdAndUpdate(
            getUserInfo._id,
            { $push: { s3Catalogs: newFile } },
            {
               new: true,
            },
         ).select('-password');

         console.log('this is the user info from db' + newAccountDetails);

         // await newAccountDetails.save()
         return res.status(201).json(newAccountDetails);
      } catch (error) {
         res.status(400);
         return res.json({ error: error });
      }
   },
);

export default s3UploadRouter;
