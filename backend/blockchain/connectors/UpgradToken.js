'use strict';

const config = require("../../config/config")
const bigNumber = require('bignumber.js')
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const Tx = require('ethereumjs-tx')
const Web3 = require("web3");
const { buffer } = require("stream/consumers");
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

    // get Balance :-
    // when u are sending tx using web3 to your smart contracts.
    // They can either be transction which will consume gas or calls will not consume any gas(which will only fetching data from blockchain) 
    // if u don't want to consume gas :- make sure u calling web3 instance or calling method with " Call " property.

    let balance = await contract.method.balanceOf(address).call()

    // handle decimal 
    // in  smart contrat --> 1.23 :- response u get = 123
    // but you need to show balance again as 1.23 so u need to convert it again : u need to add decimal point back to that 123 number 
    // to get decimal u need to divide in place of multiply

    let decimals = await contract.method.decimals().call()      // U get this balance () from smart contract(upgradToken) state variable, bcz it will automatically get getter function
    balance = bigNumber(balance).div(10**decimals).toString()
    return balance;
    
}

async function allowance(owner, spender){

    // contract object 
    let contract = await upgradToken();

    // get balance 
    let balance = await contract.method.allowance(owner, spender).call()

    // handle decimals 
    // in  smart contrat --> 1.23 :- response u get = 123
    // but you need to show balance again as 1.23 so u need to convert it again : u need to add decimal point back to that 123 number 
    // to get decimal u need to divide in place of multiply
    let decimals = await contract.method.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance;

}

// Helper function : convert btw decimal & integer value thet needs to send to the network or recived from network
// --> functionalities for geting balance and converting into decimal number is repitative everytime. so for that we have written two helper function

// so whenever value need to send to the smart contract you need to remove the decimals
// whenever you recived value from the smart contract u need to add decimals 

// rawValue fun allows to remove the decimals
async function rawValue(value){

    // contract object
    let contract = await upgradToken();

    // handle decimals
    let decimals = await contract.method.decimals().call()
    return parseInt(value * (10 ** decimals));

}

// decimalBalance fun allows to add the decimals
async function decimalBalance(value){

    // contract object
    let contract = await upgradToken();

    let decimals = await contract.methods.decimals().call()
    return bigNumber(value).div(10**decimals).toString();


}

// Helper function to sign tx : remember everytime tx has sent to network, which is going to change the state of network,
// for any such tx to go through for it to be accecpted by the network : it needs to be first sign befor it can sent to network.
// signing of tx happens using private key --> private key has sent to then backend service from frontend whenever user initiate post request.
// as part of your backend serice u're going to use private key to sign transfer whenever u call functions like transfer etc
// we are using ethereumjs-tx module to enable us to sign tx from backend service

// rawTxOject : un-signed tx Json object with all properties that tx needs
// 1. getting instnace of tx by passing Json obj (rawTxObject)
// 2. execute (.sign() method by passing private key and convert into 'hex' buffer) ans stored in tx variable
// 3. serialized that perticular tx variable
// 4. once it is seralized then return it with adding "0x" at beginning

async function signTransaction(rawTxObject, privateKey){

    // Sign transction
    let tx = new Tx.Transaction(rawTxObject);
    //let tx = new Tx(rawTxObject);
    tx.sign(buffer.from(privateKey, 'hex'))
    let serializedTx = tx.serialize()
    return "0x" + serializedTx.toString('hex')

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