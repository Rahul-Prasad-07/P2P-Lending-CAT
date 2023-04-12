'use strict';

const config = require("../../config/config")
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const upgradToken = require("./UpgradToken")
const Tx = require('ethereumjs-tx')
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))

async function defiPlatform(){

    // Reference
    let contractObj
    let contractJSON
    let abi
    let address

    // Create Contract Object
    address = config.smartContract.defiplatform.address
    contractJSON = JSON.parse(fs.readFileSync(config.smartContract.defiplatform.buildPath));
    abi = contractJSON.abi;
    contractObj = new web3.eth.Contract(abi, address)

    return contractObj
}

async function signTransaction(rawTxObject, privateKey) {

    // Sign Transaction
    let tx = new Tx.Transaction(rawTxObject);
    // let tx = new Tx(rawTxObject)
    tx.sign(Buffer.from(privateKey, 'hex'))
    let serializedTx = tx.serialize()
    return "0x" + serializedTx.toString('hex')

}

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp, nonce) {

    try {

        // Contract Object
        let contract = await defiPlatform()

        // Token Address
        let tokenAddress = web3.utils.toChecksumAddress(config.smartContract.upgradToken.address)

        // TX Data
        amount = await upgradToken.rawValue(amount)
        amount = web3.utils.toHex(amount)
        paybackAmount = await upgradToken.rawValue(paybackAmount)
        paybackAmount = web3.utils.toHex(paybackAmount)

        // Manage Nonce
        if (nonce == null){
            nonce = await web3.eth.getTransactionCount(from)
        }
        nonce = web3.utils.toHex(nonce)
    
        
        // Get Gas Price
        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        // Get Gas Limit
        let gasLimit = web3.utils.toHex(config.smartContract.defiplatform.gasLimit)

        // Collateral
        collateral = web3.utils.toWei(collateral, 'ether')
        collateral = web3.utils.toHex(collateral)
        collateralCollectionTimeStamp = parseInt(collateralCollectionTimeStamp)

        // Validate Transaction By Calling it first
        await contract.methods.ask(amount, paybackAmount, purpose, tokenAddress, collateralCollectionTimeStamp).call({value:collateral})

        // Create Raw transaction
        let txData = contract.methods.ask(amount, paybackAmount, purpose, tokenAddress, collateralCollectionTimeStamp).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.defiplatform.address,
            nonce : nonce,
            gasPrice: gasPrice,
            value: collateral,
            chainId: config.blockchain.chainId
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.error(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function getRequests() {

    // Contract Object
    let contract = await defiPlatform()
    return (await contract.methods.getRequests().call())

}

async function getRequestParameters(address) {

    // Contract Object
    let contract = await defiPlatform()
    return (await contract.methods.getRequestParameters(address).call())

}

async function getRequestState(address) {

    // Contract Object
    let contract = await defiPlatform()
    return (await contract.methods.getRequestState(address).call())

}

async function getCollateralBalance(address) {

    // Contract Object
    let contract = await defiPlatform()
    return (await contract.methods.getCollateralBalance(address).call())

}

async function cancel(from, privateKey, requestAddress) {

    try {

        // Contract Object
        let contract = await defiPlatform()

        // TX Data
        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.defiplatform.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.cancelRequest(requestAddress).call({from: from})

        // Create Raw transaction (Frontend)
        let txData = contract.methods.cancelRequest(requestAddress).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.defiplatform.address,
            nonce : nonce,
            gasPrice: gasPrice
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.error(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function lend(from, privateKey, requestAddress) {

    try {

        // Contract Object
        let contract = await defiPlatform()

        // TX Data
        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.defiplatform.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.lend(requestAddress).call({from: from})

        // Create Raw transaction (Frontend)
        let txData = contract.methods.lend(requestAddress).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.defiplatform.address,
            nonce : nonce,
            gasPrice: gasPrice
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.error(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function payback(from, privateKey, requestAddress) {

    try {

        // Contract Object
        let contract = await defiPlatform()

        // TX Data
        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.defiplatform.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.payback(requestAddress).call({from: from})

        // Create Raw transaction (Frontend)
        let txData = contract.methods.payback(requestAddress).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.defiplatform.address,
            nonce : nonce,
            gasPrice: gasPrice
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.error(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function collect(from, privateKey, requestAddress) {

    try {

        // Contract Object
        let contract = await defiPlatform()

        // TX Data
        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.defiplatform.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.collectCollateral(requestAddress).call({from: from})

        // Create Raw transaction (Frontend)
        let txData = contract.methods.collectCollateral(requestAddress).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.defiplatform.address,
            nonce : nonce,
            gasPrice: gasPrice
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.error(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

module.exports = {
    ask,
    getRequests,
    getRequestParameters,
    getRequestState,
    cancel,
    getCollateralBalance,
    lend,
    payback,
    collect,
    defiPlatform: defiPlatform
}
