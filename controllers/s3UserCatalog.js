import asyncHandler from 'express-async-handler';
import multerS3 from 'multer-s3';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import User from '../dataLayer/accountModel.js';
import {
   ListBucketsCommand,
   PutObjectCommand,
   S3Client,
} from '@aws-sdk/client-s3';
import {
   getSignedUrl,
   S3RequestPresigner,
} from '@aws-sdk/s3-request-presigner';

const credentials = {
   region: process.env.REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
};

const initiates3Client = new S3Client(credentials);

const presignedURL = (key) => {
   const region = process.env.REGION;
   const bucket = process.env.CATALOG_UPLOAD_S3_BUCKET;
   const client = new S3Client(credentials);
   const command = new PutObjectCommand({ Bucket: bucket, Key: key });

   return getSignedUrl(client, command, { expiresIn: 3600 });
};

const getPresignedUrl = asyncHandler(async (req, res) => {
   const result = await presignedURL('Testcatalog');

   res.json(result);
});

export { getPresignedUrl };
