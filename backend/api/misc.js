'use strict'

const util = require("../tools/util")
const apiLogger = require("../tools/logging").apiLogger
const refStrings = require("../constants/refStrings")


// Ping function --> our backend is alive or not (use): this is helper function
async function ping(req, res){

    try{

        // Log request
        await apiLogger.logRequest(req)

        // Create Response
        const response = await util.successResponse({success: refStrings.success})

        // Log Response
        await apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

module.exports = {
    ping
}