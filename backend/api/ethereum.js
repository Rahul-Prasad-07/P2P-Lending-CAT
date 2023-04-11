'use strict'

const ethereumController = require("../controller/ethereum")
const util = require("../tools/util")


// Getting balance of ethereum account 
async function balance(req, res){
    try{

        // Refernace : input parameteres that user input it -->
        //  after being handle then passed on to furthur functions defined in controller files ( where all logics defined )
        let address
        let response

        // Get Data
        address = req.query.address

        // Get Balance 
        response = await ethereumController.balance(address)

        //  Create Resposne 
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)

    }

   
}
module.exports = {
    balance
}