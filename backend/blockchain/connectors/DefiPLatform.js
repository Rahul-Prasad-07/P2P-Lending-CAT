'use strict';

// This is the final file of our entire DeFi Platform

const config = require("../../config/config")
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const upgradToken = require("./UpgradToken")
const Tx = require('ethereumjs-tx')
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url)) // getting instance of web3

// defiPlatform fun allows us to get instnace of smart contract
async function defiPlatform(){

    // referenace
    let contractObj
    let contractJSON
    let abi
    let address

    // create contract object
    address = config.smartContract.defiPlatform.address
    contractJSON = JSON.parse(fs.readdirSync(config.smartContract.defiPlatform.buildPath));
    abi = contractJSON.abi;
    // we use both abi & address to get instance of contract ny using web3.eth.Contract method
    contractObj = new web3.eth.Contract(abi,address);

    return contractObj;
    
}

// signTransaction fun helps to sign transaction : Helper function
async function signTransaction(rawTxObject, privateKey){

    // sign Transaction
    let tx = new Tx.Transaction(rawTxObject);
     // let tx = new tx(rawTxObject)
    tx.sign(Buffer.from(privateKey, 'hex'));
    let serializedTx = tx.serialize();
    return "0x"+ serializedTx.toString('hex');

}

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp, nonce){

    try{

        // contract Object : getting instance of smart contract
        let contract = await defiPlatform();

        // Token address : for executing ask req we need to include a token account or 
        // smart contract token that we are raisng borrow request : we raised borrow req for upGrad Token ( CAT token)
        let tokenAddress = web3.utils.toChecksumAddress(config.smartContract.upgradToken.address);

        // Tx data : buil Transaction data using first getting & converting into 'hex'
        amount = await upgradToken.rawValue(amount);
        amount = web3.utils.toHex(amount);
        paybackAmount = await upgradToken.rawValue(paybackAmount);
        paybackAmount = web3.utils.toHex(paybackAmount);

        // Manage Nonce : get nonce as we get for upgradToken file
        if(nonce == null){
            nonce = await web3.eth.getTransactionCount(from);
        }
        nonce = web3.utils.toHex(nonce);

        // Get Gas Price 
        let gasPrice  = await ethereumUtil.getGasPrice();
        gasPrice = web3.utils.toHex(gasPrice);

        // Get Gas Limit 
        let gasLimit = web3.utils.toHex(config.smartContract.defiPlatform.gasLimit);

        // collateral
        collateral = web3.utils.toWei(collateral, 'ether');
        collateral = web3.utils.toHex(collateral);
        collateralCollectionTimeStamp = parseInt(collateralCollectionTimeStamp);

        // validate transaction by calling it first 
        await contract.method.ask(amount, paybackAmount, purpose, tokenAddress, collateralCollectionTimeStamp).call({value: collateral});

        // create raw transaction
        let txData = contract.method.ask(amount, paybackAmount, purpose, tokenAddress, collateralCollectionTimeStamp).encodeABI()

        let rawTx = {
            gasLimit : gasLimit,
            data: txData,
            from : from,
            to : config.smartContract.defiPlatform.address,
            nonce : nonce,
            gasPrice : gasPrice,
            value : collateral,
            chainId : config.blockchain.chainId
        }

        // Sign transaction (wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey);

        return await web3.eth.sendSignedTransaction(signedTransaction);


    }
    catch(error){
        console.error(error);
        throw new userException(new ErrorMessage(error.data.stack, 500));

    }

}

// getrequest : allows to get request from the network
async function getRequests(){

    // contract object 
    let contract = await defiPlatform();
    return (await contract.method.getRequests().call());

}

// getRequestsParameters : allows to get request parameters for each indivudal req
async function getRequestsParameters(address){

    // contract object
    let contract = await defiPlatform();
    return (await contract.method.getRequestsParameters(address).call());

}

// getRequestsState : allows to get state of each of our request contract object
// evertime new "ask" request contract created, if you want to check state of that ask request the u can call get request state method.
async function getRequestsState(address){

     // Contract Object
     let contract = await defiPlatform()
     return (await contract.methods.getRequestState(address).call())
 

}

// getCollateralBalance : give balance of every single request contract that is created after ask req made
async function getCollateralBalance(address){

    // Contract Object
    let contract = await defiPlatform()
    return (await contract.methods.getCollateralBalance(address).call())


}

// cancel, lend, payback,collect : all fun we can operate on an ask request contract after it has been created
async function cancel(from, privateKey, requestAddress){

    try{

        // contract object 
        let contract = await defiPlatform();

        // Tx data 
        let nonce = await web3.eth.getTransactionCount(from);
        nonce = web3.utils.toHex(nonce);

        let gasPrice = await ethereumUtil.getGasPrice();
        gasPrice = web3.utils.toHex(gasPrice);

        let gasLimit = web3.utils.toHex(config.smartContract.defiPlatform.gasLimit);

        // Validate Transaction By Calling it first
        await contract.methods.cancelRequest(requestAddress).call({from: from})

        // Create Raw transaction (Frontend)
        let txData = contract.methods.cancelRequest(requestAddress).encodeABI()
        let rawTx = {
            gasLimit : gasLimit,
            data : txData,
            from : from,
            to : config.smartContract.defiPlatform.address,
            nonce : nonce,
            gasPrice : gasPrice
        }

        // sign transaction (wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey);

        return await web3.eth.sendSignedTransaction(signedTransaction);

    }
    catch(error){
        console.error(error);
        throw new userException(new ErrorMessage(error.data.stack, 500));
    }

}

async function lend(from, privateKey, requestAddress){

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

async function payback(from, privateKey, requestAddress){

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

async function collect(from, privateKey, requestAddress){

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

module.export ={
    ask,
    getRequests,
    getRequestsParameters,
    getRequestsState,
    cancel,
    getCollateralBalance,
    lend,
    payback,
    collect,
    defiPlatform: defiPlatform
}