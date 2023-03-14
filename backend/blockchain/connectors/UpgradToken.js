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

}

async function balance(address){
    
}

async function allowance(owner, spender){

}

async function rawValue(value){

}

async function decimalBalance(value){

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