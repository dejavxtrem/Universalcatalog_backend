 import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {getProductToken} from '../middleware/productSearchApi.js'
import qs from 'qs';
import aws4 from 'aws4';
const AmazonAccountIdentifier = process.env.AMAZONGROUP_IDENTIFIER
const awsSecretKey = process.env.API_SECRETKEY;
const awsAccessKey = process.env.API_ACCESSKEY;

let baseuri = 'na.business-api.amazon.com';

const placeOrderFunction =  async (payload) => {
    let response;
    const { 
        cartItems,
        shippingAddress, 
        ItemPriceTotal, 
        shippingPrice,
        taxPrice,
        totalPrice} = payload



    const orderRequestPayload = {
        externalId: uuidv4(),
        lineItems:[
            {
                externalId: uuidv4(),
                quantity: cartItems[0].qty,
                attributes: [
                    {
                        attributeType: "SelectedProductReference",
                        productReference: {
                            productReferenceType: "ProductIdentifier",
          
                            id: cartItems[0].productAsin
                         }
                    }
                ],
                expectations: [
                    {
                        expectationType: "ExpectedUnitPrice",
         
                        amount: {
                           currencyCode: "USD",
         
                           amount: cartItems[0].price
                        }
                     },
                     {
                        expectationType: "ExpectedCharge",
                        amount: {
                            currencyCode: "USD",
                            amount: ItemPriceTotal
                        },
                        source: "SUBTOTAL"
                    },
                    
                ]
            }
        ],
        attributes: [
            {
                attributeType: "PurchaseOrderNumber",
                purchaseOrderNumber: "201803906_AK4756_0726_003",
            },
            {
                attributeType: "BuyerReference",
       
                userReference: {
                   userReferenceType: "UserEmail",
       
                   emailAddress: process.env.AMAZON_GROUPEMAIL
                }
             },
             {
                attributeType: "BuyingGroupReference",
       
                groupReference: {
                   groupReferenceType: "GroupIdentity",
       
                   identifier: AmazonAccountIdentifier
                }
             },
             {
                attributeType: "Region",
       
                region: "US"
             },
             {
                attributeType: "SelectedPaymentMethodReference",
       
                paymentMethodReference: {
                   paymentMethodReferenceType: "StoredPaymentMethod"
                }
             },
             {
                attributeType: "ShippingAddress",
       
                address: {
                   addressType: "PhysicalAddress",
       
                   fullName: "John Doe",
       
                   phoneNumber: "8167854438",
       
                   companyName: "Fodab Tech",
       
                   addressLine1: shippingAddress.address,
       
                   addressLine2: "",
       
                   city: shippingAddress.city,
       
                   stateOrRegion: shippingAddress.state,
       
                   postalCode: shippingAddress.postCode,
       
                   countryCode: shippingAddress.country
                }
             },
             {
                attributeType: "TrialMode"
            }
        ]
     }

     const { data } = await getProductToken();
     const accessToken = data.access_token;


     console.log(JSON.stringify(accessToken, null, 2))

     try {
        response = await axios({
            method: 'POST',
            url: 'https://na.business-api.amazon.com/ordering/2022-10-30/orders',
            headers: {
               'Content-Type': 'application/json',
               'x-amz-access-token': accessToken,
            },
            data: JSON.stringify(orderRequestPayload),
        })
        console.log(response.headers)
        return response.data

     } catch (error) {
       if (error.response) {
         console.error("Error Response:", error.response.data);
       }
     }

  


     //return orderRequestPayload

}

export {
    placeOrderFunction
}