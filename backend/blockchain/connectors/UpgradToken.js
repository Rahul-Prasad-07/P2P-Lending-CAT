'use strict';

const config = require("../../config/config")
const bigNumber = require('bignumber.js')
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const Tx = require('ethereumjs-tx')
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))

async function upgradToken(){

    // refereance 
    let contractObj
    let contractJSON
    let abi
    let address

    // create contract object and get instance of it 
    address = config.smartContract.upgradToken.address
    contractJSON = JSON.parse(fs.readFileSync(config.smartContract.upgradToken.buildPath));
    abi = contractJSON.abi;
    contractObj = new web3.eth.Contract(abi,address);
    // -> u are using web3.eth.contract method to get instance of smart contract deployed pn connected eth network.
    // -> this will take two paramters as input (abi and address ) both of these things together allows us to get instance of sc.
    
    return contractObj;

}

async function balance(address){

    // contract object 
    let contract = await upgradToken()

    // get Balance 
    let balance = await contract.method.balanceOf(address).call()

    // handle decimal
    let decimals = await contract.method.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()
    return balance;
    
}

async function allowance(owner, spender){

    // contract object 
    let contract = await upgradToken();

    // get balance 
    let balance = await contract.method.allowance(owner, spender).call()

    // handle decimals 
    let decimals = await contract.method.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance;

}

async function rawValue(value){

    // contract object
    let contract = await upgradToken();

    let decimals = await contract.method.decimals().call()
    return parseInt(value * (10 ** decimals));

}

async function decimalBalance(value){

    // contract object
    let contract = await upgradToken();

    let decimals = await contract.methods.decimals().call()
    return bigNumber(value).div(10**decimals).toString();


}

async function signTransaction(rawTxObject, privateKey){

}

async function transfer(from, to, amount, privateKey){

}

async function approve(from, to,amount,privateKey){

}

module.export ={

    balance,
    allowance,
    transfer,
    approve,
    upgradToken: upgradToken,
    rawValue,
    decimalBalance

}