'use strict';

const upgradTokenController = require("../controller/upgradToken")
const util = require("../tools/util")

async function balance(req, res){

    try{

        // Reference
        let address
        let response

        // Get Data
        address = req.query.address

        // Get Balance
        response = await upgradTokenController.balance(address)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function allowance(req, res){

    try{

        // Reference
        let owner
        let spender
        let response

        // Get Data
        owner = req.query.owner
        spender = req.query.spender

        // Get Balance
        response = await upgradTokenController.allowance(owner, spender)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function transfer(req, res){

    try{

        // Reference
        let from
        let to
        let privateKey
        let amount
        let response

        // Get Data
        from = req.body.from
        to = req.body.to
        amount = req.body.amount
        privateKey = req.body.privateKey

        // Get Balance
        response = await upgradTokenController.transfer(from, to, amount, privateKey)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function approve(req, res){

    try{

        // Reference
        let from
        let to
        let privateKey
        let amount
        let response

        // Get Data
        from = req.body.from
        to = req.body.to
        amount = req.body.amount
        privateKey = req.body.privateKey

        // Get Balance
        response = await upgradTokenController.approve(from, to, amount, privateKey)

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
    balance,
    allowance,
    transfer,
    approve
}
