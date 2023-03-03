'use strict'

const defiPlatformConnector = require("../blockchain/connectors/DefiPLatform")
const upgradTokenConnector = require("../blockchain/connectors/UpgradToken")
const ethereumUtil = require("../blockchain/util")
const config = require("../blockchain/util")
const web3 = require("web3")
const web3 = new web3 (new web3.providers.httpProvider(config.blockchain.url))
const util = require("../tools/util")

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp){

    try{


    }
    catch(error){
        
    }
}