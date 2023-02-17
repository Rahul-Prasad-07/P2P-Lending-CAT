import { expect } from "chai";
import {ethers, upgrades} from "hardhat";
import {Contract, ContractFactory, Signer} from "ethers";

let DeFiPlatform: ContractFactory;
let defiplatform: Contract;
let Governance: ContractFactory;
let governance: Contract;
let UpgradToken: ContractFactory;
let upgradtoken: Contract;
let accounts: Signer[];

const collectionTimestamp = 1644440016;

describe("DeFi Platform", function () {
  
  beforeEach(async function () {
    // Get accounts
    accounts = await ethers.getSigners();
  
    // Deploy upgrad token
    UpgradToken = await ethers.getContractFactory("UpgradToken");
    upgradtoken = await UpgradToken.deploy(100000000, "CatCoin", 0, "CAT");
    await upgradtoken.deployed();
    
    // Deploy upgradable governance
    Governance = await ethers.getContractFactory("Governance");
    governance = await upgrades.deployProxy(Governance, [2]);
    await governance.deployed();
  
    // Deploy DeFi Platform
    DeFiPlatform = await ethers.getContractFactory("DefiPlatform");
    defiplatform = await DeFiPlatform.deploy(governance.address);
    await defiplatform.deployed();
  });
  
  it("Should check ask request for valid inputs", async function () {
    const options = {value: ethers.utils.parseEther("1.0")}
    await expect(defiplatform.ask(0, 0, "Education Loan", upgradtoken.address, collectionTimestamp, options)).to.be.reverted;
    await expect(defiplatform.ask(100, 100, "Education Loan", upgradtoken.address, collectionTimestamp, options)).to.be.reverted;
    await expect(defiplatform.ask(100, 100, "Education Loan", upgradtoken.address, collectionTimestamp)).to.be.reverted;
  });
  
  it("Should be able to create an ask request", async function () {
    const options = {value: ethers.utils.parseEther("1.0")}
    await defiplatform.ask(100, 101, "Education Loan", upgradtoken.address, collectionTimestamp, options);
    expect(await defiplatform.getRequests()).to.be.an("array").of.length(1);
  });
  
  it("Should be able to lend for an ask request", async function () {
    // Create an ask request from account 2
    const options = {value: ethers.utils.parseEther("1.0")}
    await defiplatform.connect(accounts[1]).ask(100, 101, "Education Loan", upgradtoken.address, collectionTimestamp, options);
    // Get created ask request
    const askRequests = await defiplatform.getRequests();
    
    // Approve allowance for Ask Request Contract to spend lenders token balance
    await upgradtoken.approve(askRequests[0], 100);
    // Lend for this ask request from account 1
    await expect(defiplatform.lend(askRequests[0])).to.emit(defiplatform, "LoanGiven").withArgs();
    expect(await upgradtoken.balanceOf(await accounts[1].getAddress())).to.equal("100");
  });
  
  it("Should be able to payback an ask request", async function () {
    // Create an ask request from account 2
    const options = {value: ethers.utils.parseEther("1.0")}
    await defiplatform.connect(accounts[1]).ask(100, 101, "Education Loan", upgradtoken.address, collectionTimestamp, options);
    // Get created ask request
    const askRequests = await defiplatform.getRequests();
    
    // Approve allowance for Ask Request Contract to spend accounts 1 token balance
    await upgradtoken.approve(askRequests[0], 100);
    
    // Lend for this ask request from account 1
    await defiplatform.lend(askRequests[0]);
    
    // Fund some additional tokens in account 2
    await upgradtoken.transfer(await accounts[1].getAddress(), 1);
  
    // Approve allowance for Ask Request Contract to spend account 2 token balance
    await upgradtoken.connect(accounts[1]).approve(askRequests[0], 101);
    
    // Check payback result
    await expect(defiplatform.connect(accounts[1]).payback(askRequests[0])).to.emit(defiplatform, "LoanReturned").withArgs();
    expect(await upgradtoken.balanceOf(await accounts[1].getAddress())).to.equal("0");
    
  });
  
});