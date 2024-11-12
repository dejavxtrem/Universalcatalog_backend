import xml2js from "xml2js";
import asyncHandler from 'express-async-handler';
import { getUserEmailAddressXMLBody } from '../util/generateSessionId.js'
import { v4 as uuidv4 } from 'uuid';
import Session from "../dataLayer/userBuyerSessionSchema.js";

const receivePunchOutSetupRequest = asyncHandler(async (req, res) => {



     const cxmlRequest = req.body;
     

    const parsedData = await getUserEmailAddressXMLBody(cxmlRequest)
    const { emailAddress , firstName , lastName , buyerReturnURL} = parsedData;

     if (!emailAddress || !firstName || !lastName || !buyerReturnURL) {
        res.status(400)
        throw new Error('Invalid Request')
     } else {

        const sessionId = uuidv4()

        // const sessionSchema = new Session({
        //     sessionId: uuidv4(),
        //     emailAddress,
        //     firstName,
        //     lastName,
        //   })
        //   await sessionSchema.save();
        // }           
       
        // const findSessionByEmail = await Session.find({emailAddress})
        // console.log(findSessionByEmail)


        try {
            console.log(sessionId)
            const punchOutResponse = `<?xml version="1.0" encoding="UTF-8"?>
           <cXML payloadID="response_12345" timestamp="${new Date().toISOString()}">
             <Response>
                 <PunchOutSetupResponse>
                     <StartPage>
                         <URL>http://localhost:3000/home/${sessionId}</URL>
                     </StartPage>
                 </PunchOutSetupResponse>
             </Response>
         </cXML>`
        
        
        const sessionSchema = new Session({
            sessionId: uuidv4(),
            emailAddress,
            firstName,
            lastName,
          })
          await sessionSchema.save();
        

        if (cxmlRequest && sessionSchema) {
         // Send PunchOut Setup Response back to the buyer
          res.set('Content-Type', 'application/xml');
          res.send(punchOutResponse);
        } else {
         res.status(404)
         throw new Error('cXML Request not found')
        }
        } catch (error) {
            console.log(error)
        }
        






     }
    




       
})

export {
    receivePunchOutSetupRequest
}