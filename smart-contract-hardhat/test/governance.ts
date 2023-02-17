import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import {Contract, ContractFactory, Signer} from "ethers";

let Governance: ContractFactory;
let governance: Contract;
let accounts: Signer[];

describe("Governance", function () {
  
  beforeEach(async function () {
    // Get accounts
    accounts = await ethers.getSigners();
    // Deploy upgrad token
    Governance = await ethers.getContractFactory("Governance");
    governance = await upgrades.deployProxy(Governance, [2]);
    await governance.deployed();
  });
  
  it("Should be deployed as an upgradable contract", async function () {
    
    expect(await governance.isPlatformEnabled()).to.equal(true);
    
  });
  
  it("Should disable platform on receiving enough votes", async function () {
    
    await governance.flag();
    expect(await governance.isPlatformEnabled()).to.equal(true);
    await governance.flag();
    expect(await governance.isPlatformEnabled()).to.equal(true);
    await governance.flag();
    expect(await governance.isPlatformEnabled()).to.equal(false);
    
  });
  
});