
// we have configuration for blockchain url and parameter along with port and ip address 
// is what we are passing into web3 instance to initiate a new instance.

// property of this instance 127.0.0.1--> represnt localhost 8545--> this is where your ganache instance avaiable
// which we've started and deployed a smart contract on . Ganache's RPC server is exposed at 127.0.01:8545 & we are providing that same instance as web3 provider to our module.
// bcz of that that web3 instance connected with ganache & have access to the deployed smart contracts 

// note --> u cloud changed the HTTP provider to any other blockchain node that you wanted to connected to depending on which blockchain platfor u want to connect.
//  wheather its local node , Geath node , or ganache instance or ropstane network or mainnet network.

// To give u sense of that : we have change our blokchain url from ganache to an IP ADDRESS given by ROPSTAN network or mainnet network which is exposed by infura api services .

'use strict'

// global
var path = require('path');
var config = {}
var projectDirectory = path.resolve(__dirname, "..")
var smartContractDirectory = path.resolve(__dirname, "../../smart-contract-hardhat")

// Enviornment
config.env = 'development'

/******************** Express Server config *************************/
config.server = {}
config.server.host = '0.0.0.0'
config.server.port = 5001

/******************** Blockchain *************************/
config.blockchain = {}
// config.blockchain.url = "http://127.0.0.1:8545"
config.blockchain.url = "https://sepolia.infura.io/v3/dd0d1ffd15954086a4c1eed15171a62d"
config.blockchain.chainId = "5"

/******************** Blockchain *************************/

/******************** Smart Contract *************************/
config.smartContract = {}
config.smartContract.upgradToken = {}
config.smartContract.upgradToken.address = "0x24ACb50C27CD21D05a9302686b1256d8a081602e" // need to upgrad:done
config.smartContract.upgradToken.gasLimit = 100000
config.smartContract.upgradToken.buildPath = smartContractDirectory + "/artifacts/contracts/CatTokenContract.sol/UpgradToken.json"
config.smartContract.defiplatform = {}
config.smartContract.defiplatform.address = "0x45E6aB80EFFaAcd8d430B696452443De110FC0B9" // need to upgrad:done
config.smartContract.defiplatform.gasLimit = 6000000
config.smartContract.defiplatform.buildPath = smartContractDirectory + "/artifacts/contracts/DeFiPlatformContract.sol/DefiPlatform.json"

/******************** Smart Contract *************************/

/******************** Wallet *************************/
config.wallet = {}
/******************** Wallet *************************/

/**********************Logging***********************/
config.logs = {}
config.logs.consoleLogs = true
config.logs.fileLogs = false
config.logs.api = {}
config.logs.api.path = "/var/log/defi/"
config.logs.api.category = "API"
/**********************Logging***********************/

module.exports = config;
