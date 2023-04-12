'use strict';

// Global
var path = require('path');
var config = {}
var projectDirectory = path.resolve(__dirname, "..")
var smartContractDirectory = path.resolve(__dirname, "../../smart-contract-hardhat")

// Enviornment
config.env = 'production'

/******************** Express Server config *************************/
config.server = {}
config.server.host = '0.0.0.0'
config.server.port = 5001
/******************** Express Server config *************************/

/******************** Blockchain *************************/
config.blockchain = {}
config.blockchain.url = "https://sepolia.infura.io/v3/dd0d1ffd15954086a4c1eed15171a62d"
config.blockchain.chainId = "11155111"
/******************** Blockchain *************************/


/******************** Smart Contract *************************/
config.smartContract = {}
config.smartContract.upgradToken = {}
config.smartContract.upgradToken.address = "0x3e4202D63e5d3EE64a1fC1A1eB3504646065Ae6A" // need to upgrad:done
config.smartContract.upgradToken.gasLimit = 100000
config.smartContract.upgradToken.buildPath = smartContractDirectory + "/artifacts/contracts/UpgradTokenContract.sol/UpgradToken.json"
config.smartContract.defiplatform = {}
config.smartContract.defiplatform.address = "0x7F371DfFE9Fa44435900be27059B62dae4CA80b1" // need to upgrad:done
config.smartContract.defiplatform.gasLimit = 2000000
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