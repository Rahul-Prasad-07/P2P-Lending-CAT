'use strict'

const config = require('../config/config.js')
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const Web3 = require("web3")
const web3 = new Web3(new Web3.provider.httpProvider(config.blockchain.url));

async function isAddressValid(addresses){

    addresses.forEach(address => {

        // check if address is valid 
        const isValid = web3.utils.isAddress(address);

        if(isValid == false){
            throw new userException(userErrors.InvalidAddress)
        }
    });
}

async function getGasPrice(){

    // get gas price 
    let gasPrice = await web3.eth.getGasPrice()
    gasPrice = parseInt(gasPrice)

    return gasPrice
}

async function getETHBalance(address){

    // check if address is valid 
    await isAddressValid([address])

    // get balance 
    let balance = await web3.eth.getBalance(address)
    balance = web3.util.fromWei(balance, 'ether')

    return balance
}

module.exports = {
    getGasPrice,
    getETHBalance,
    isAddressValid
}