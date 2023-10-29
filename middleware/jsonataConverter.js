import jsonata from "jsonata";

const convertData = async(data) => {

try {
    
    const expression = jsonata(
      `$.{
        "Supplier": _source."\ufeffSupplierName",
       "productName": _source.Name,
       "SupplierPartNum": _source."SupplierPartNum",
       "ProductDescription": _source.Description,
        "Price": _source.Price,
        "Currency": _source.Currency,
        "UOMcode": _source."UOM code",
        "Image": _source."Image Url",
        "Active": _source.active
    }`
    )
     
   const convertedResult = await expression.evaluate(data)
   return convertedResult

} 
catch (error) {
    console.log(error)
}

}

const convertProductSearch = async (data) => {

    //console.log('This is the data to convert' + JSON.stringify(data))
 try {
       
        const expression = jsonata(
            `$.products.{
                "Supplier": "Amazon Business",
               "productName": $.title,
               "SupplierPartNum": $.asin,
               "ProductDescription": $.productDescription,
                "Price": $.includedDataTypes.OFFERS[0].price.value.amount,
                "merchant": $.includedDataTypes.OFFERS[0].merchant.name,
                "Currency": $.includedDataTypes.OFFERS[0].price.value.currencyCode,
                "ImageUrl": $.includedDataTypes.IMAGES,
                "productOverview": $.productOverview,
                "Active": _source.body.active
            }`
          )
    
          const convertedProductSearchResult = await expression.evaluate(data)

          //console.log(JSON.stringify(convertedProductSearchResult))

          return convertedProductSearchResult
       
 } catch (error) {
    console.log(error)
 }
}

const convertProductSearchDetail = async (data) => {
    try {
        const expression = jsonata(
            `$.{
                "Supplier": "Amazon Business",
               "productName": $.title,
               "SupplierPartNum": $.asin,
               "ProductDescription": $.productDescription,
                "Price": $.includedDataTypes.OFFERS[0].price.value.amount,
                "merchant": $.includedDataTypes.OFFERS[0].merchant.name,
                "Currency": $.includedDataTypes.OFFERS[0].price.value.currencyCode,
                "ImageUrl": $.includedDataTypes.IMAGES,
                "productOverview": $.productOverview,
                "Active": _source.body.active
            }`
          )

          const convertedProductDetail = await expression.evaluate(data)

          return  convertedProductDetail

    } catch (error) {
        console.log(error)
    }
}


export {
    convertData,
    convertProductSearch,
    convertProductSearchDetail
}