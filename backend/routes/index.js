
'use strict';
const express = require('express');
const router = express.Router();
const misc = require("../api/misc")
const upgradToken = require("../api/upgradToken")
const defiPlatform = require("../api/defiPlatform")
const ethereum = require("../api/ethereum")

// Misc
router.get("/v1/misc/ping", misc.ping)

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
