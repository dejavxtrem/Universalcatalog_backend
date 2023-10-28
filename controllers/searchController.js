
import asyncHandler from 'express-async-handler';
import { 
getProductSearchItem , 
opensearchResult , 
getProductByAsin ,
openSearchByAsinSupplier

} from '../middleware/productSearchApi.js'
import {convertProductSearch, convertProductSearchDetail} from '../middleware/jsonataConverter.js'


const getProducts = asyncHandler(async (req, res) => {

    const searchWord = req.query.searchword
    //const page = req.query.page
    const page = 10

     if (!searchWord|| !page) {
        res.status(400)
        throw new Error('Invalid parameter')
     }
    //console.log(page)
    console.log(searchWord)
      
    //const pageSize = 10
    //const page = 
    const {data} = await getProductSearchItem(searchWord)

    //console.log(' This is product search result' + JSON.stringify(data))

    //console.log(JSON.stringify(data.products))

    //convert structure with jsonata
    const convertedResult = await convertProductSearch(data)

    //opensearch query search
    const result = await opensearchResult(searchWord)

    if (typeof(result) === "object") {
        const mergedResult = [...convertedResult, result]
        res.status(200).json(mergedResult)
    } else  {

    const mergedResult = [...convertedResult, ...result] 
     //console.log(JSON.stringify(mergedResult))
    res.status(200).json(mergedResult)
    }
    //console.log(JSON.stringify(result))
    //  const mergedResult = [...convertedResult, ...result] || [...convertedResult, result]
    //  console.log(JSON.stringify(mergedResult))
    // res.status(200).json(mergedResult)
})


const getProductById = asyncHandler(async (req, res) => {
    const asinId = req.params.id


    //console.log('this is the asinID' + asinId)
    const {data} = await getProductByAsin(asinId)

    const convertedResult = await convertProductSearchDetail(data)

    res.status(200).json(convertedResult)
})


const getProductByHostedCatalog = asyncHandler(async (req, res) => {
    const asinId = req.params.id
    const supplierName = req.params.supplierName

    const data = await openSearchByAsinSupplier(asinId, supplierName)

    res.status(201).send(data)
})



export {
    getProducts,
    getProductById,
    getProductByHostedCatalog
}