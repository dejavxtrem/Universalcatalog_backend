import asyncHandler from 'express-async-handler';
import {
   getProductSearchItem,
   getProductByAsin,
   opensearchResult,
   openSearchByAsinSupplier
} from '../middleware/productSearchApi.js';
import {
   convertProductSearch,
   convertProductSearchDetail,
   convertProductDetailHostedCatalog
} from '../middleware/jsonataConverter.js';

const getProducts = asyncHandler(async (req, res) => {
   const searchWord = req.query.searchword;
   //const page = req.query.page
   const page = 10;

   //console.log(req.user)
   const businessName = req.user.businessName;

   if (!searchWord || !page) {
      res.status(400);
      throw new Error('Invalid parameter');
   }
   //console.log(page)
   console.log(searchWord);

   //const pageSize = 10
   //const page =
   const { data } = await getProductSearchItem(searchWord);

   //console.log(data)

   //console.log(' This is product search result' + JSON.stringify(data))

   //console.log(JSON.stringify(data.products))

   //convert structure with jsonata
   const convertedResult = await convertProductSearch(data);

   //console.log(' This is the converted result' + JSON.stringify(convertedResult , null , 2))

   //MongoDb Searcg query search
   const result = await opensearchResult(searchWord, businessName);

  //console.log(' This is the merged result ' + JSON.stringify(result , null , 2));

   // if (typeof(result) === "object") {
   //     const mergedResult = [...convertedResult, result]
   //     res.status(200).json(mergedResult)
   // } else  {




   if (result === undefined) {
      const mergedResult = convertedResult
      res.status(200).json(mergedResult);
   } else {
      const mergedResult = convertedResult.concat(result)

      res.status(200).json(mergedResult);
   }
   
   


   //  console.log(JSON.stringify(mergedResult))

   // res.status(200).json(mergedResult)
   // }

   //console.log(JSON.stringify(result));

 


   //console.log(JSON.stringify(mergedResult , null , 2));

   // res.status(200).json(mergedBothResult);
});

const getProductById = asyncHandler(async (req, res) => {
   const asinId = req.params.id;


   const { data } = await getProductByAsin(asinId);

   

   const convertedResult = await convertProductSearchDetail(data);

   //console.log('this is the asinID' + JSON.stringify(convertedResult, null, 2))

   res.status(200).json(convertedResult);
});


//Hosteed Catalog API endpoint
const getProductByHostedCatalog = asyncHandler(async (req, res) => {
   const asinId = req.params.id;
   const supplierName = req.params.supplierName;

   console.log('this is supplier name ' + supplierName)

   console.log('this is supplier name ' + asinId)

   const data = await openSearchByAsinSupplier(asinId, supplierName);

 

   res.status(201).send(data);
});

export { getProducts, getProductById , getProductByHostedCatalog};
