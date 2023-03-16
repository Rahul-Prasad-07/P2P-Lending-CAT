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
    
}

async function signTransaction(rawTxObject, privateKey){

}

async function ask(from, amount , privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp, nonce){

}

async function getRequests(){

}

async function getRequestsParameters(address){

}

async function getRequestsState(address){

}

async function getCollateralBalance(address){

}

async function cancel(from, privateKey, requestAddress){

}

async function lend(from, privateKey, requestAddress){

}

async function payback(from, privateKey, requestAddress){

}

async function collect(from, privateKey, requestAddress){

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