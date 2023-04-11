'use strict';

// keeping tracks fo all routes 
const express = require('express');
const router = express.Router();
const misc = require("../api/misc");
const upgradToken = require("../api/upgradToken");
const defiPlatform = require("../api/defiPlatform");
const ethereum = require("../api/ethereum");

// Our backend app slipts our functionalites in 3 Groups

// misc
router.get("/v1/misc/ping",misc.ping)

// Ethereum
router.get("/v1/ethereum/balance", ethereum.balance)

// Token
router.get("/v1/upgradToken/balance", upgradToken.balance)
router.get("/v1/upgradToken/allowance", upgradToken.allowance)
router.post("/v1/upgradToken/transfer", upgradToken.transfer)
router.post("/v1/upgradToken/approve", upgradToken.approve)

// P2P Platform
router.post("/v1/defiPlatform/ask", defiPlatform.ask)
router.post("/v1/defiPlatform/lend", defiPlatform.lend)
router.post("/v1/defiPlatform/payback", defiPlatform.payback)
router.post("/v1/defiPlatform/collect", defiPlatform.collect)
router.post("/v1/defiPlatform/cancel", defiPlatform.cancel)
router.post("/v1/defiPlatform/askBatch", defiPlatform.askBatch)
router.get("/v1/defiPlatform/request", defiPlatform.request)

module.exports = router

// SO using all of these routes, we defining path or parameteres from where the fron-end is going to ask for this data
// or push the data to the backend and then evetually to the blockchain network
// each of these path , they particular function that is going to excecute inside the seprate file or node js module

// all of these functions will excecute firdt in API folder --> inside of these files (API) : where they handle user's request as they come in.
// this is where we are going to take in input parameters and decides what needs to happen on those input request when user trigger any http restful apis

