import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';

import { placeOrderFunction } from '../middleware/amazonOrderMiddleware.js';

import Order from '../dataLayer/orderRequestModel.js';

//import cxml parser for Poom
import { generateCXMLPOOM } from '../util/generateSessionId.js'

const createOrderRequest = asyncHandler(async (req, res) => {

    const { 
         cartItems , 
         shippingAddress, 
         ItemPriceTotal, 
         shippingPrice,
         taxPrice,
         totalPrice
        } = req.body
 
        //console.log('this is the user ID' + req.user)

//console.log('This is the carItem details' + JSON.stringify(cartItems, null , 2))

 const payload = { 
    cartItems , 
    shippingAddress, 
    ItemPriceTotal, 
    shippingPrice,
    taxPrice,
    totalPrice}

    //console.log(payload)

const data = await placeOrderFunction(payload)

 console.log('THIS IS ORDER DATA' + JSON.stringify(data, null, 2))

 let Orders = []

 if (!data || data == undefined)  {
    res.status(400)
    throw new Error('Unable to place order')
  }

for (const item of  data?.lineItems) {
     const OrderItem = {
        externalId: item.externalId,
        supplier: cartItems[0].supplier,
        productImage: cartItems[0].productImage,
        productName: cartItems[0].productName,
        qty: item.acceptedItems[0].quantity,
        price: item.acceptedItems[0].artifacts[1].amount.amount,
        productID: cartItems[0].productAsin,
        orderID: item.acceptedItems[0].artifacts[6].identifier,
        deliveryDate: item.acceptedItems[0].artifacts[0].upperBoundary
}
    Orders.push(OrderItem)
}

console.log(JSON.stringify(Orders, null , 2))


if (data && Orders.length > 0)  {
    const createNewOrder = new Order({
        user: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        businessName: req.user.businessName,
        shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postCode
            ,
            country: shippingAddress.country,
        },
        taxPrice: data.acceptanceArtifacts[1].amount.amount,
        shippingPrice: data.acceptanceArtifacts[2].amount.amount,
        totalPrice: data.acceptanceArtifacts[0].amount.amount,
        orderItems: Orders
        
    })

    
    console.log('This is the carItem details' + JSON.stringify(createNewOrder, null , 2))


    const createdOrder = await createNewOrder.save()
    res.status(200).json(createdOrder);
}
})

const getConfirmedOrderbyId = asyncHandler(async (req, res) => {
    
    console.log('This is the order ID' + req.params.id) 


  const order = await Order.findById(req.params.id)


  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})



const submitCartPoomMessage = asyncHandler(async(req, res) => {
const { 
    cartItems , 
    shippingAddress, 
    ItemPriceTotal, 
    shippingPrice,
    taxPrice,
    totalPrice
   } = req.body

  const cartDetails = {
    cartItems , 
    shippingAddress, 
    ItemPriceTotal, 
    shippingPrice,
    taxPrice,
    totalPrice
  }
  const poomMessage = await generateCXMLPOOM(cartDetails)

  console.log('this is the poom message' + JSON.stringify(poomMessage, null, 2))

  //  console.log('this is order cart items body' + JSON.stringify(cartItems , null , 2))

   res.status(200).json('This is the poom endpoint')



})

export {
  createOrderRequest,
  getConfirmedOrderbyId , 
  submitCartPoomMessage
  
}