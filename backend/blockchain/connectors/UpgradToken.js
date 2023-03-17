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
    tx.sign(Buffer.from(privateKey, 'hex'))
    let serializedTx = tx.serialize()
    return "0x" + serializedTx.toString('hex')

}


// transfer function trigger via Https post request
// all of this parameters filter through, all of filtaration and sanitation that we do at controller level and then send to connector.
// 1. get instance to smart contract
// 2. remove decimals & convert into hex(bcz blockchain only understand hex)
// 3. Inclued nounce property : increment over no of Tx that have previously been executed from perticular account.
// 4. Calculate GasPrice : using helper function which is alredy written as part of ethereum utility inside blockchain folder.
// 5. GasLimit : that u can define as part of your tx --> we have define global gaslimit in cofig 
// 6. Mock call of this transfer function : reason to do validation of your execution by doing call tell u any issue for structuring your function or to avoid gas cosume problem
// 7. send tarnsaction on network for this we are going to build our tx object (rawtx object that we than pass for signature)--> pass this rawtx in signTransction fun

async function transfer(from, to, amount, privateKey){

    try{

    // contract object
    let contract = await upgradToken();

    // TX Data
    amount = await rawValue(amount)  // remove decimals 
    amount = web3.utils.toHex(amount)  // convert into hex 

    let nonce = await web3.eth.getTrasactionCount(from)
    nonce = web3.utils.toHex(nonce);

    let gasPrice = await ethereumUtil.getGasPrice()
    gasPrice = web3.utils.toHex(gasPrice)

    // validate tx by calling it first 
    await contract.method.transfer(to, amount).call()

    // Create raw tx
    // whatever data that u're passing to smart contract(to, value) that get inclued in data property of raw tx obj
    let txData = contract.method.transfer(to,amount).encodeABI()
    let rawTx = {
        gasLimit: gasLimit,
        data: txData,
        from: from,
        to: config.smartContract.upgradToken.address,
        nonce: nonce,
        gasPrice: gasPrice,
    }

    // sign transaction(wallet)
    let signedTransaction = await signTransaction(rawTx, privateKey)

    // return 
    return await web3.eth.sendSignedTransaction(signedTransaction)

    }
    catch(error){
        console.log(error);
        throw new userException(new ErrorMessage(error.data.stack, 500));
    }

    


}

async function approve(from, to,amount,privateKey){

    try{

      // Contract Object
      let contract = await upgradToken()

      // TX Data
      amount = await rawValue(amount)
      amount = web3.utils.toHex(amount)

      let nonce = await web3.eth.getTransactionCount(from)
      nonce = web3.utils.toHex(nonce)

      let gasPrice = await ethereumUtil.getGasPrice()
      gasPrice = web3.utils.toHex(gasPrice)

      let gasLimit = web3.utils.toHex(config.smartContract.upgradToken.gasLimit)

      // Validate Transaction By Calling it first
      await contract.methods.approve(to, amount).call()

      // Create Raw transaction (Frontend)
      let txData = contract.methods.approve(to, amount).encodeABI()
      let rawTx = {
          gasLimit: gasLimit,
          data: txData,
          from: from,
          to: config.smartContract.upgradToken.address,
          nonce : nonce,
          gasPrice: gasPrice,
      }

      // Sign Transaction (Wallet)
      let signedTransaction = await signTransaction(rawTx, privateKey)
        
      // Return
      return await web3.eth.sendSignedTransaction(signedTransaction)


    }
    catch(error){
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

module.exports = {
    balance,
    allowance,
    transfer,
    approve,
    upgradToken: upgradToken,
    rawValue,
    decimalBalance
}