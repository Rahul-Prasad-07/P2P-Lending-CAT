'use strict'

const config = require('../config/config.js')
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const Web3 = require("web3")
const web3 = new Web3(new Web3.provider.httpProvider(config.blockchain.url));

// --> provide functionalites borrowed from web3 
// created an instance of web3 by providing HTTP provider or blockchain provider.
// whenever u instantiate a new web3 instance, u have to provide an address of node on 
// the blockchain platform that your web3 instance is going to use to get instance of your smart contract.
// we are passing where url for blockchain is availabe --> httpProvider(config.blockchain.url). 
// we have defined diff configuration files for diff stage of our app 
// 1. development 2. production 3. staging in config folder 

// we have configuration for blockchain url and parameter along with port and ip address 
// is what we are passing into web3 instance to initiate a new instance.

// property of this instance 127.0.0.1--> represnt localhost 8545--> this is where your ganache instance avaiable
// which we've started and deployed a smart contract on . Ganache's RPC server is exposed at 127.0.01:8545 & we are providing that same instance as web3 provider to our module.
// bcz of that that web3 instance connected with ganache & have access to the deployed smart contracts 

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

    // get gas price : using web3 funtionalities & use getGasPrice method of web3's ETH module 
    // to estimate current gas price of network
    let gasPrice = await web3.eth.getGasPrice()
    gasPrice = parseInt(gasPrice)

    return gasPrice
}

async function getETHBalance(address){

    // check if address is valid 
    await isAddressValid([address])

    // get balance : using web3 eth.getBalance function underlying ethereum network (ganache ethereum network or whatevere you have defined instance)
    let balance = await web3.eth.getBalance(address)
    balance = web3.util.fromWei(balance, 'ether')

    return balance
}

module.exports = {
    getGasPrice,
    getETHBalance,
    isAddressValid
}