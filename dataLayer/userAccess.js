// import {
//    QueryCommand,
//    DynamoDBClient,
//    DynamoDB,
//    PutItemCommand,
//    GetItemCommand
// } from '@aws-sdk/client-dynamodb';
// import {
//    DynamoDBDocumentClient,
//    DynamoDBDocument,
//    PutCommand,
//    GetCommand,
// } from '@aws-sdk/lib-dynamodb';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// const credentials = {
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.ACCESS_KEY_ID,
//       secretAccessKey: process.env.SECRET_KEY_ID
//     }
//   };

const marshallOptions = {
   convertEmptyValues: false, // false, by default.
   removeUndefinedValues: true, // false, by default.
   convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
   wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };
//translateConfig

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

const s3Client = new S3Client({
   signatureVersion: 'v4',
});

const userTable = process.env.USER_TABLE;
const s3Bucket = process.env.CATALOG_UPLOAD_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

console.log('This is the userTable' + userTable);

async function createUserAccount(userInfo) {
   try {
      const params = {
         TableName: userTable,
         Item: {
            userID: userInfo.userId,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            emailID: userInfo.email,
            password: userInfo.password,
            businessName: userInfo.businessName,
         },
         ConditionExpression: `attribute_not_exists(userInfo.userId) OR attribute_not_exists(userInfo.email)`,
      };

      const command = new PutCommand(params);

      const response = await ddbDocClient.send(command);

      console.log(
         console.log('This is the error type' + JSON.stringify(response)),
      );

      return response;
   } catch (error) {
      console.log(error);
   }
}

async function getItemDetails(userInfo) {
   console.log(userInfo.email);

   const command = new GetCommand({
      TableName: userTable,
      Key: {
         userID: userInfo.userId,
         emailID: userInfo.email,
      },
      ProjectionExpression: 'emailID',
   });
   const getResponse = await ddbDocClient.send(command);
   console.log(`Got the movie: ${JSON.stringify(getResponse)}`);
   return getResponse.Item;
}

async function getAccountDetailsById(userId) {
   const userIdString = { S: userId };
   const emailID = { S: 'johndoe@doe.com' };
   const input = {
      TableName: userTable,
      KeyConditionExpression: 'emailID = :emailID AND userIdString = :userID',

      ExpressionAttributeValues: {
         ':userID': userIdString,
         ':emailID': emailID,
      },
      ConsistentRead: true,
   };

   const result = new QueryCommand(input);
   console.log(JSON.stringify(result));
   const { Item } = await ddbDocClient.send(result);
   return Item;
}

export { createUserAccount, getItemDetails, getAccountDetailsById };
