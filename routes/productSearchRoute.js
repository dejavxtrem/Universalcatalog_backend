import express from 'express'
import {verifyToken} from '../middleware/authMiddleware.js'
const productSearchRouter = express.Router()

import {
    getProducts,
    getProductById,
    getProductByHostedCatalog
} from '../controllers/searchController.js'

productSearchRouter.get('/getProduct', verifyToken, getProducts)
productSearchRouter.get('/getProductByAsin/:id', verifyToken, getProductById)
productSearchRouter.get('/getProductByAsin/hostedCatalog/:id/:supplierName', verifyToken, getProductByHostedCatalog)

export default productSearchRouter