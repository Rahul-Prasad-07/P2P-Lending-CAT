'use strict '

const upgradTokenUtil = require("../blockchain/connectors/UpgradToken")
const ethereumUtil = require("../blockchain/util")

// This balance fun fetch balance of upgradToken inside of any account
// --> bcz for every account on network, there would be underlying native currency balance .
// Where in controller/ethereum.js --> balance fun fetch ether balance of every account 
async function balance(address){

    try{

        // Refereance 
        let response 
        let balance 

        // befor we acces the connector --> we 1st performing some sanity  check on input paramtere : Reason ?
        //--> bcz blockchain network you're going to consume resources , 
        // It's going to take some time, and if its put req or it's going to chnage state of blockchain : it's also consume gas 
        // so, the controllers make sure that all functionalites that you would want to build in your project
        // to avoid these unneccesary gas consumption from obvious issues of error that cloud trigger on the blockchain when you send Wrongly unformatted input parameteres
        // can be handled as part of this controller module that we have designed here .


        // Validate address
        await ethereumUtil.isAddressValid([address])


        // Get balance 
        balance = await upgradTokenUtil.balance(address)
        response = {balance}

        return response


    }
    catch(error){
        throw error
    }
}

async function allowance (owner , spender ){

    try{

        // referance 
        let reposne 
        let balance 

        // validate address 
        await ethereumUtil.isAddressValid([owner, spender])

        // Get Balance 
        balance = await upgradTokenUtil.allowance(owner, spender)
        response = {balance}

        return response


    }
    catch(error){
        throw error 
    }
}

async function transfer (from, to, amount, privateKey){

    try{

        //refreance 
        let response
        let txDetails

        // validate Address
        await ethereumUtil.isAddressValid([from, to])

        // Get Balance 
        txDetails = await upgradTokenUtil.transfer(from, to, amount, privateKey)
        response = {txDetails}

        return response


    }
    catch(error){
        throw error 
    }
}

async function approve(from, to, amount, privateKey){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([from, to])

        // Get Balance
        txDetails = await upgradTokenUtil.approve(from, to, amount, privateKey)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

module.exports ={
    balance,
    allowance,
    transfer,
    approve
}