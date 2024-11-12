import express from 'express';
import colors from 'colors';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorMiddleware.js';
import cors from 'cors';
import connectDB from './config/db.js';
//const connectDB = require('./config/db');
import userRouter from './routes/userRoutes.js';
import s3UploadRouter from './routes/s3CatalogUpload.js';
import productSearchRouter from './routes/productSearchRoute.js';
import createOrderRequestRouter from './routes/placeOrderRoute.js';
import punchOutReceiverRouter from './routes/punchoutRoute.js';


const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/xml' }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('tiny'));
}

app.use('/api/users', userRouter);
app.use('/api/search', productSearchRouter);
app.use('/api/catalog', s3UploadRouter);
app.use('/api/orders', createOrderRequestRouter);
app.use('/api/punchout', punchOutReceiverRouter);


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
