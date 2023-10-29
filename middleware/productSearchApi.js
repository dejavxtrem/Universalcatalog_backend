import moment from 'moment'
import axios from 'axios'
import aws4 from 'aws4'
import qs from 'qs'
import { Client } from '@opensearch-project/opensearch'
import { defaultProvider} from '@aws-sdk/credential-provider-node'
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws'
import { convertData, convertProductSearch} from './jsonataConverter.js'
import jsonata from 'jsonata'

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const refresh_token = process.env.REFRESH_TOKEN
const awsSecretKey = process.env.API_SECRETKEY
const awsAccessKey = process.env.API_ACCESSKEY


let baseuri = "na.business-api.amazon.com";
let region = "us-east-1";

//open search connect
const openSearchConnect = new Client({
    ...AwsSigv4Signer({
       region: process.env.REGION,
       service: "es",
       getCredentials: () => {
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
       },
    }),
    node: process.env.CATALOG_ENDPOINT,
 });




const getProductToken =  async () => {

 try {
    const accessToken = axios({
        method: 'post',
        url: 'https://api.amazon.com/auth/O2/token',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
           'grant_type': 'refresh_token',
           'refresh_token': refresh_token,
           'client_id': client_id,
           'client_secret': client_secret 
           })
    })

    return accessToken

    } catch (error) {
        console.log(error)

    }

}

//Product search API result
const getProductSearchItem = async (searchword) => {

try {

    const {data } = await getProductToken()

    const accessToken = data.access_token

    const productSearchCall =  axios(aws4.sign({
    
        service: 'execute-api',
        region: region,
        method: 'GET',
        host:  baseuri,
        path:  `/products/2020-08-26/products?productRegion=US&locale=en_US&facets=OFFERS,IMAGES&pageSize=10&keywords=${searchword}`,
        url: 'https://' + baseuri + `/products/2020-08-26/products?productRegion=US&locale=en_US&facets=OFFERS,IMAGES&pageSize=10&keywords=${searchword}`,
        headers: {
            'x-amz-access-token': accessToken,
		   
		    'Content-Type': 'application/x-www-form-urlencoded',
        }
     }, {
        secretAccessKey: awsSecretKey,
	    accessKeyId: awsAccessKey
     }
     
     ))

    
      

     return productSearchCall

     

} catch (error) {
    console.log(error)
}

}


const getProductByAsin = async (asinId) => {

    // console.log('This is the ASIN' + JSON.stringify(asinId))
    try {
         const {data } = await getProductToken()

         const accessToken = data.access_token

         const productSearchByAsin =  axios(aws4.sign({
    
            service: 'execute-api',
            region: region,
            method: 'GET',
            host:  baseuri,
            path:  `/products/2020-08-26/products/${asinId}?productRegion=US&locale=en_US&facets=OFFERS,IMAGES`,
            url: 'https://' + baseuri + `/products/2020-08-26/products/${asinId}?productRegion=US&locale=en_US&facets=OFFERS,IMAGES`,
            headers: {
                'x-amz-access-token': accessToken,
               
                'Content-Type': 'application/x-www-form-urlencoded',
            }
         }, {
            secretAccessKey: awsSecretKey,
            accessKeyId: awsAccessKey
         }
         
         ))

         return productSearchByAsin
    
    } catch (error) {
        console.log(error)
    }
}


//Open search Catalog
const opensearchResult = async (searchword, businessName) => {
 
    const result = await  openSearchConnect.search({
    
        index: `${businessName}_catalog`,
        q: searchword
        
     }) 

     //console.log(JSON.stringify(result))

    const openSearchResult = result?.body?.hits?.hits

      //console.log(JSON.stringify(openSearchResult))

     if (openSearchResult.length <= 0) {
        const jsonataResult = []
        return jsonataResult
     } 
    
     else {
        const jsonataResult = await convertData(openSearchResult)
        //console.log(JSON.stringify(jsonataResult))
        return jsonataResult
     }

    

   

   //console.log('this is the match query result' +  jsonataResult)

    //return result.body.hits.hits
     
     
}

//opensearch catalog
const openSearchByAsinSupplier = async (asinId, supplierName) => {

    //console.log(asinId)
    //const SupplierPartNum = "SupplierPartNum"
    //const supplierName = "Amazon"
    const query = {
        query: {
            query_string: {
                query: asinId
            }
        }
    }
    const result = await openSearchConnect.search(
        {
            index: "testbusiness_catalog",
            body: query
        }
    )

    console.log(JSON.stringify(result))

    const openSearchResultByASIN = result?.body?.hits?.hits

    if (openSearchResultByASIN.length <= 0) {
        const jsonataResult = []
        return jsonataResult
     } 
     else {
        const jsonataResult = await convertData(openSearchResultByASIN)
        return jsonataResult
     }

}

export {
    getProductSearchItem,
    opensearchResult,
    getProductByAsin,
    openSearchByAsinSupplier
}