import { expect } from "chai";
import { ethers } from "hardhat";
import {Contract, ContractFactory, Signer} from "ethers";

let UpgradToken: ContractFactory;
let upgradtoken: Contract;
let accounts: Signer[];

describe("Upgrad Token", function () {
	
	beforeEach(async function () {
		// Get accounts
		accounts = await ethers.getSigners();
		// Deploy upgrad token
		UpgradToken = await ethers.getContractFactory("UpgradToken");
		upgradtoken = await UpgradToken.deploy(100000000, "CatCoin", 0, "CAT");
		await upgradtoken.deployed();
	});
	
    //asserstion 
    
	it("Should have allocated total supply to token owner", async function () {
		const owner = await accounts[0].getAddress();
		expect(await upgradtoken.balanceOf(owner)).to.equal("100000000");
		
	});
	
	it("Should be able to transfer own tokens to another account ", async function () {
		const owner = await accounts[0].getAddress();
		const receiver = await accounts[1].getAddress();
		
		await upgradtoken.transfer(receiver, 5);
		expect(await upgradtoken.balanceOf(receiver)).to.equal("5");
		
	});
	
	it("Should be able to approve allowance for some spender account", async function () {
		const owner = await accounts[0].getAddress();
		const spender = await accounts[1].getAddress();
		
		await upgradtoken.approve(spender, 100);
		expect(await upgradtoken.allowance(owner, spender)).to.equal("100");
		
	});
	
	it("Should be able to spend on behalf of another account after getting approval", async function () {
		const owner = await accounts[0].getAddress();
		const spender = await accounts[1].getAddress();
		const receiver = await accounts[2].getAddress();
		
		await upgradtoken.approve(spender, 100);
		await upgradtoken.connect(accounts[1]).transferFrom(owner, receiver, 100);
		expect(await upgradtoken.balanceOf(receiver)).to.equal("100");
		
	});
	
});