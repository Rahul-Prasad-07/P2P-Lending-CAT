'use strict'

const defiPlatformConnector = require("../blockchain/connectors/DefiPlatform")
const upgradTokenConnector = require("../blockchain/connectors/UpgradToken")
const ethereumUtil = require("../blockchain/util")
const config = require("../blockchain/util")
const web3 = require("web3")
const web3 = new web3 (new web3.providers.httpProvider(config.blockchain.url))
const util = require("../tools/util")

// same excat things 
// 1. taking the input parameters
// 2. validating some checks
// 3. continue forwarding them downwordsor downstream to the defiplatform connector
// 4. whatever response u get from connector is sent as response back to the API function

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp){

    try{

        // referance 
        let response
        let txDetails

        // validate address
        await ethereumUtil.isAddressValid([from])

        // Get Data
        txDetails = await defiPlatformConnector.ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp)
        response = {txDetails}

        return response


    }
    catch(error){
        
    }
}

async function request(){

    try{

        // referance 
        let response =[]
        let tmpResponse =[]
        let requestArray

        // get data 
        requestArray = await defiPlatformConnector.getRequest()

        // iterate on requests
        for(let i=0; i < requestArray.length; i++){

            // get request data 
            let requestContractAddress = requestArray[i]

            let requestParam = await defiPlatformConnector.getRequestParameters(requestContractAddress)
            let requestState = await defiPlatformConnector.getRequestState(requestContractAddress)
            let collateralBalance = await defiPlatformConnector.getCollateralBalance(requestContractAddress)

            requestParam["requestContractAddress"] = requestContractAddress
            requestParam["collateralBalance"] = collateralBalance
            tmpResponse.push({...requestParam, ...requestState})
        }

        // fix data 
        for(let i =0; i < tmpResponse.length; i++){

            // data 
            let request = tmpResponse[i]

            let askAmount = await upgradTokenConnector.decimalBalance(request.askAmount)
            let paybackAmount = await upgradTokenConnector.decimalBalance(request.paybackAmount)
            let collateral = web3.utils.fromWei(request.collateral, 'ether')
            let collateralBalance = web3.utils.fromWei(request.collateralBalance, 'ether')

            let tmpRequest = {

                "requestContractAddress" : request.requestContractAddress,
                "collateralBalance" : collateralBalance,
                "asker": request.asker,
                "lender": request.lender,
                "askAmount": askAmount,
                "paybackAmount": paybackAmount,
                "purpose" : request.purpose,
                "moneyLent": request.moneyLent,
                "debtSettled": request.debtSettled,
                "collateral" : collateral,
                "collateralCollected": request.collateralCollected,
                "collateralCollectionTimeStamp": request.collateralCollectionTimeStamp,
                "currentTimeStamp" : request.currentTimeStamp
            }

            response.push(tmpRequest)
        }

        return response


    }
    catch(error){
        throw error
    }
}

async function cancel(from, privateKey, requestAddress){

    try{

        // referance 
        let response
        let txDetails

        // validate address
        await ethereumUtil.isAddressValid([requestAddress])

        // get data 
        txDetails = await defiPlatformConnector.cancel(from, privateKey, requestAddress)
        response = {txDetails}

        return response


    }
    catch(error){
        throw error 
    }
}

async function lend(from, privateKey, requestAddress){

    try{

        // referance
        let response
        let txDetails

        // validate address
        await ethereumUtil.isAddressValid([requestAddress])

        // get data
        txDetails = await defiPlatformConnector.lend(from, privateKey, requestAddress)
        response = {txDetails}

        return response


    }
    catch(error){
        throw error
    }
}

async function payback( from, privateKey, requestAddress){

    try{

        // referance 
        let response 
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await defiPlatformConnector.payback(from, privateKey, requestAddress)
        response = {txDetails}

        return response



    }
    catch(error){
        throw error
    }
}

async function collect(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await defiPlatformConnector.collect(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function askBatch(from, privateKey, transactionData){

    try {

        // Reference
        let response = []
        let txDetails
        let nonce

        // Set initial value of nonce
        nonce = await web3.eth.getTransactionCount(from)

        // Iterate Over Transaction
        const iterateNewTransactions = async () => {
        await util.asyncForEach(transactionData, async (tx) => {
                
                 // Get Data
                txDetails = await defiPlatformConnector.ask(from, tx.amount, privateKey, tx.paybackAmount, tx.purpose, tx.collateral, tx.collateralCollectionTimeStamp, nonce)
                response.push(txDetails)

                // Increment Nonce
                nonce = nonce + 1
                
            });
        }
        await iterateNewTransactions()
        
        return response

    } catch (error) {
        throw error
    }

}


module.exports = {
    ask,
    request,
    cancel,
    lend,
    payback,
    collect,
    askBatch
}