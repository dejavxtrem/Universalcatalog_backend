import { DeleteBucketInventoryConfigurationCommand } from '@aws-sdk/client-s3'
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supplier_Id: {
      
    },
      
          firstName: { type: String},
          lastName: { type: String},
          email: { type: String},
          businessName: { type: String },
          shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            },
            taxPrice: { type: Number, required: true },
            shippingPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
             orderItems: [
                {   externalId: { type: String},
                    supplier: { type: String, required: true },
                    productImage: { type: String},
                    qty: { type: String},
                    price: { type: Number},
                    productName: { type: String},
                    productID: { type: String},
                    orderID: { type: String, required: true },
                    deliveryDate: { type: Date},
                }
             ]
},
{
    timestamps: true,
  })


const Order = mongoose.model('Order', orderSchema)


export default Order