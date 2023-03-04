'use strict'

const ethereumUtil = require("../blockchain/util");


// This balance fun fetch ether balance of every account 
async function balance(address){

    try{

        // referance 
        let response
        let balance 

        // Get Balance 
        balance = await ethereumUtil.getETHBalance(address)
        response = {balance}

        return response 



    }
    catch(error){
        throw error 
    }
}

module.exports = {
    balance
}