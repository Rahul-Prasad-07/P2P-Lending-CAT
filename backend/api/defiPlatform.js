'use strict';

const defiPlatformController = require("../controller/defiPlatform")
const util = require("../tools/util")

async function ask(req, res){

    try{

        // Reference
        let from
        let privateKey
        let amount
        let paybackAmount
        let purpose
        let collateral
        let collateralCollectionTimeStamp
        let response

        // Get Data
        from = req.body.from
        amount = req.body.amount
        privateKey = req.body.privateKey
        paybackAmount = req.body.paybackAmount
        purpose = req.body.purpose
        collateral = req.body.collateral
        collateralCollectionTimeStamp = req.body.collateralCollectionTimeStamp

        // Get Data
        response = await defiPlatformController.ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function request(req, res){

    try{

        // Reference
        let response

        // Get Data
        response = await defiPlatformController.request()

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function cancel(req, res){

    try{

        // Reference
        let requestAddress
        let response
        let from
        let privateKey

        // Get Data
        requestAddress = req.body.requestAddress
        from = req.body.from
        privateKey = req.body.privateKey

        // Get Data
        response = await defiPlatformController.cancel(from, privateKey, requestAddress)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function lend(req, res){

    try{

        // Reference
        let requestAddress
        let response
        let from
        let privateKey

        // Get Data
        requestAddress = req.body.requestAddress
        from = req.body.from
        privateKey = req.body.privateKey

        // Get Data
        response = await defiPlatformController.lend(from, privateKey, requestAddress)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function payback(req, res){

    try{

        // Reference
        let requestAddress
        let response
        let from
        let privateKey

        // Get Data
        requestAddress = req.body.requestAddress
        from = req.body.from
        privateKey = req.body.privateKey

        // Get Data
        response = await defiPlatformController.payback(from, privateKey, requestAddress)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function collect(req, res){

    try{

        // Reference
        let requestAddress
        let response
        let from
        let privateKey

        // Get Data
        requestAddress = req.body.requestAddress
        from = req.body.from
        privateKey = req.body.privateKey

        // Get Data
        response = await defiPlatformController.collect(from, privateKey, requestAddress)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

// HINT: Do batch transaction via backend from a single address with proper nonce
async function askBatch(req, res){

    try{

        // Reference
        let transactionData
        let from
        let privateKey
        let response

        // Get Data
        transactionData = req.body.transactionData
        privateKey = req.body.privateKey
        from = req.body.from

        // Get Data
        response = await defiPlatformController.askBatch(from, privateKey, transactionData)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

module.exports = {
    askBatch,
    ask,
    request,
    cancel,
    lend,
    payback,
    collect
}
