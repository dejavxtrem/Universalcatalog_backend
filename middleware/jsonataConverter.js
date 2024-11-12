import jsonata from 'jsonata';

const convertData = async (data) => {
   try {
      const expression = jsonata(
   `$.supplier_catalog.version_history.products.{
    "Supplier": $$.supplier_name,
    "productName": $.product_Name,
    "SupplierPartNum": $.product_supplierPartNum,
    "ProductDescription": $.product_description,
    "Price": $.product_price,
    "Currency": $.product_currency,
    "UOMcode": $.product_UOMcode,
    "ImageUrlCatalog":[
        {
            "medium":{
                "url": $.product_image_URL.imageURL
            }
        }
    ],
    "Active": $.product_availability,
    "producitId": $._id
}`,
      );

      const convertedResult = await expression.evaluate(data);
      return convertedResult;
   } catch (error) {
      console.log(error);
   }
};

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
            }`,
      );

      const convertedProductSearchResult = await expression.evaluate(data);

      //console.log(JSON.stringify(convertedProductSearchResult))

      return convertedProductSearchResult;
   } catch (error) {
      console.log(error);
   }
};

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
            }`,
      );

      const convertedProductDetail = await expression.evaluate(data);

      return convertedProductDetail;
   } catch (error) {
      console.log(error);
   }
};

const convertProductDetailHostedCatalog = async(supplierName ,itemDetail ) => {

   console.log('this is supplier name ' + supplierName)
   
   try {
      const expression = jsonata(
         `$.{
               "productName": $.product_Name,
               "SupplierPartNum": $.product_supplierPartNum,
               "ProductDescription": $.product_description,
                "Price": $.product_price,
                "merchant": $.includedDataTypes.OFFERS[0].merchant.name,
                "Currency": $.product_currency,
                "ImageUrlCatalog": $.product_image_URL.imageURL,
                "productOverview": $.productOverview,
                "Active":$.product_availability
            }`,
      );

      const convertedProductDetailHostedCatalog = await expression.evaluate(itemDetail);
      return convertedProductDetailHostedCatalog;

   } catch (error) {
      console.log(error)
   }
}

export { convertData, convertProductSearch, convertProductSearchDetail, convertProductDetailHostedCatalog};
