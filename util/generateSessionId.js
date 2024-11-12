import xml2js from "xml2js";
import axios from 'axios';


const getUserEmailAddressXMLBody = async (responseBody) => {

        
        const newParser = new xml2js.Parser({ explicitArray: false, trim: true});        

   return new Promise((resolve, reject) => {
    newParser.parseString(responseBody, (err, result) => {
        if (err) {
            reject(err);
        } else {
            const UserDetails = {
                emailAddress: result?.cXML?.Request?.PunchOutSetupRequest?.Extrinsic[3]['_'],
                firstName: result?.cXML?.Request?.PunchOutSetupRequest?.Extrinsic[2]['_'],
                lastName: result?.cXML?.Request?.PunchOutSetupRequest?.Extrinsic[1]['_'],
                buyerReturnURL: result?.cXML?.Request?.PunchOutSetupRequest?.BrowserFormPost.URL
            }
            resolve(UserDetails);
        }
    });
   })
     
      
}


const generatedPOOM = (cartDetails) => {
    const PoomcXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <cXML payloadID="12345" timestamp="${new Date().toISOString()}" version="1.2.011">
        <Header>
            <From>
           <Credential domain="DUNS">
                <Identity>128990368</Identity>
            </Credential>
            <Credential domain="NetworkId">
                <Identity>Amazon</Identity>
            </Credential>
            </From>
            <To>
                <Credential domain="DUNS">
                    <Identity>Universal123</Identity>
                </Credential>
            </To>
            <Sender>
              <Credential domain="DUNS">
                <Identity>128990368</Identity>
            </Credential>
            <Credential domain="NetworkId">
                <Identity>Amazon</Identity>
            </Credential>
            <UserAgent>Amazon LLC eProcurement Application</UserAgent>
            </Sender>
        </Header>
        <Message>
            <PunchOutOrderMessage>
                <BuyerCookie>random_session_cookie</BuyerCookie>
                <PunchOutOrderMessageHeader operationAllowed="edit">
                    <Total>
                        <Money currency="USD">${cartDetails.totalPrice}</Money>
                    </Total>
                    <Shipping>
                    <Money currency="USD">${cartDetails.shippingPrice}</Money>
                    <Description xml:lang="en-US">Cost of shipping, not including shipping tax.</Description>
                  </Shipping>
                <Tax>
                    <Money currency="USD">${cartDetails.taxPrice}</Money>
                    <Description xml:lang="en-US">Cost of tax, including shipping tax.</Description>
                </Tax>
            <ShipTo>
          <Address isoCountryCode="US" addressID="13">
            <Name xml:lang="en">John Doe Enterprise inc</Name>
            <PostalAddress name="default">
              <DeliverTo>John Doe</DeliverTo>
              <Street>${cartDetails.shippingAddress.address}</Street>
              <City>${cartDetails.shippingAddress.city}</City>
              <State>${cartDetails.shippingAddress.state}</State>
              <PostalCode>${cartDetails.shippingAddress.postCode}</PostalCode>
              <Country isoCountryCode="US">United States</Country>
            </PostalAddress>
            <Email name="default">john.doe@example.com</Email>
            <Phone name="default">
              <TelephoneNumber>
                <CountryCode isoCountryCode="US">1</CountryCode>
                <AreaOrCityCode>212</AreaOrCityCode>
                <Number>5563398</Number>
                <Extension/>
              </TelephoneNumber>
            </Phone>
          </Address>
          </ShipTo>
                </PunchOutOrderMessageHeader>
                <ItemIn quantity="${cartDetails.cartItems.length}">
                    ${cartDetails?.cartItems.map(item => `
                    <ItemDetail>
                    <SupplierPartID>${item.productAsin}</SupplierPartID>
                        <UnitPrice>
                            <Money currency="USD">${item.price}</Money>
                        </UnitPrice>
                        <Description>${item.productName}</Description>
                        <Quantity>${item.qty}</Quantity>
                        <SupplierName>${item.supplier}</SupplierName>
                        <ProductImageURL>${item.productImage}</ProductImageURL>
                    </ItemDetail>`).join('')}
                </ItemIn>
            </PunchOutOrderMessage>
        </Message>
    </cXML>
    `;
    return PoomcXML;

}

const  generateCXMLPOOM = async (cartDetails) => {

 //console.log('this is the cart details' + JSON.stringify(cartDetails, null, 2))

 const cxmlPoomPayload = generatedPOOM(cartDetails)

 //send poom message back to erp system

 try {
    const response = await axios.post('http://localhost:9000/api/punchout/poomessage', cxmlPoomPayload , {
        headers: {
            'Content-Type': 'application/xml'
        }
    })

    console.log('this is the response' + JSON.stringify(response.data, null, 2))

 } catch (error) {
    console.log(error)
 }

 //console.log('this is the cxml poom payload' + cxmlPoomPayload)

    // const newParser = new xml2js.Parser({ explicitArray: false, trim: true});
    // return new Promise((resolve, reject) => {
    //     newParser.parseString(cxmlPOOM, (err, result) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(result);
    //         }
    //     });
    // })
}


export {
    getUserEmailAddressXMLBody,
    generateCXMLPOOM
}