'use strict'

const upgradTokenController = require("../controller/upgradToken")
const util = require("../tools/util")

// Fetaching details about upgradToken contract that we have deployed on network
async function balance (req, res){

    // getting the value that user passing in is part of request query bcz balance fun triggerd by get HTTP API
    // All of paramters that user passes are being sent as HTTP query parameters a request query parameters
    // so we are going to fetch those user parameters as part of these url query 


    try{

        // Refrenace 
        let address 
        let response

        // Get Data
        address = req.query.address

        // Get Balance
        response = await upgradTokenController.balance(address)

        // Create response 
        response = await util.successResponse(response)

        // Send Response 
        res.status(200).send(respose)
    }
    catch(exception){
        await util.handleErrorResponse(exception, res)

    }


}

// allowance function trigger when you try acces the allowance API
// 1. fetch input parameters
// 2. passed on those to the UpgradTokenController.allownace 

async function allowance(req, res){

    try{

        // Reference
        let owner
        let spender
        let response 
        
        // Get Data 
        // Get Data
        owner = req.query.owner
        spender = req.query.spender
        
        // Get Balance
        response = await upgradTokenController.allowance(owner, spender)

        //  create response
        response = await util.successResponse(response)

        // send Response 
        res.status(200).send(response)

    }
    catch(exception){
        util.handleErrorResponse(exception, res)
    }
}


// transfer function do same thing 
// 1. get input parameters 
// 2. called upgradToken controller function 
async function transfer (req, res){

    try{

        // reference 
        let from
        let to
        let privateKey
        let response

        // Get Data 
        from = req.body.from
        to = req.body.to
        amount = req.body.amount
        privateKey = req.body.privateKey

        // Get balance
        response = await upgradTokenController.transfer(from, to, amount, privateKey)

        // create response 
        response = await util.successResponse(response)

        // send response
        res.status(200).send(response)


    }
    catch(exception){
        util.handleErrorResponse(exception, res)
    }
}

async function approve ( req, res){

    try{

        // reference 
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

        // get balance
        response = await upgradTokenController.approve(from, to,amount,privateKey)

        // create response 
        response = await util.successResponse(response)

        // send response 
        res.status(200).send(response)


    }
    catch(exception){
        util.handleErrorResponse(exception, res)
    }
}

module.exports = {
    balance,
    allowance,
    transfer,
    approve
}