'use strict';

const defiPlatformConnector = require("../blockchain/connectors/DefiPlatform")
const upgradTokenConnector = require("../blockchain/connectors/UpgradToken")
const ethereumUtil = require("../blockchain/util")
const config = require("../config/config")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))
const util = require("../tools/util")

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([from])

        // Get Data
        txDetails = await defiPlatformConnector.ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function request(){

    try {

        // Reference
        let response = []
        let tmpResponse = []
        let requestArray

        // Get Data
        requestArray = await defiPlatformConnector.getRequests()

        // Iterate on Requests
        for(let i = 0; i < requestArray.length; i++){

            // Get Request Data
            let requestContractAddress = requestArray[i]
            let requestParam = await defiPlatformConnector.getRequestParameters(requestContractAddress)
            let requestState = await defiPlatformConnector.getRequestState(requestContractAddress)
            let collateralBalance = await defiPlatformConnector.getCollateralBalance(requestContractAddress)
            requestParam["requestContractAddress"] = requestContractAddress
            requestParam["collateralBalance"] = collateralBalance
            tmpResponse.push({...requestParam, ...requestState})
        }

        // Fix Data
        for(let i = 0; i < tmpResponse.length; i++){

            // Data
            let request = tmpResponse[i]
            let askAmount = await upgradTokenConnector.decimalBalance(request.askAmount)
            let paybackAmount = await upgradTokenConnector.decimalBalance(request.paybackAmount)
            let collateral = Web3.utils.fromWei(request.collateral, 'ether')
            let collateralBalance = Web3.utils.fromWei(request.collateralBalance, 'ether')
            let tmpRequest = {
                "requestContractAddress": request.requestContractAddress,
                "collateralBalance": collateralBalance,
                "asker": request.asker,
                "lender": request.lender,
                "askAmount": askAmount,
                "paybackAmount": paybackAmount,
                "purpose": request.purpose,
                "moneyLent": request.moneyLent,
                "debtSettled": request.debtSettled,
                "collateral": collateral,
                "collateralCollected": request.collateralCollected,
                "collateralCollectionTimeStamp": request.collateralCollectionTimeStamp,
                "currentTimeStamp": request.currentTimeStamp
            }
            response.push(tmpRequest)
        }

        return response

    } catch (error) {
        throw error
    }

}

async function cancel(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await defiPlatformConnector.cancel(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function lend(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await defiPlatformConnector.lend(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function payback(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await defiPlatformConnector.payback(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
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
