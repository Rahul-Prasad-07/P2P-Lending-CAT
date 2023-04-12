import {ethers, upgrades} from "hardhat";

async function main() {
	
	const tokenSupply = 10000000;
	const tokenName = "CatCoin";
	const tokenDecimals = 0;
	const tokenSymbol = "CAT";
	
	// 1. Deploy Upgrad Token
	const UpgradToken = await ethers.getContractFactory("UpgradToken");
	const upgradtoken = await UpgradToken.deploy(tokenSupply, tokenName, tokenDecimals, tokenSymbol);
	
	await upgradtoken.deployed();
	
	console.log("Upgrad Token deployed to :", upgradtoken.address);
	
	const flaggingThreshold = 5;
	
	// 2. Deploy Governance
	const Governance = await ethers.getContractFactory("Governance");
	const governance = await upgrades.deployProxy(Governance, [flaggingThreshold]);
	
	await governance.deployed();
	
	console.log("Upgradable Governance Contract deployed to :", governance.address);
	
	// 3. Deploy DefiPlatform
	const DefiPlatform = await ethers.getContractFactory("DefiPlatform");
	const defiplatform = await DefiPlatform.deploy(governance.address);
	
	await defiplatform.deployed();
	
	console.log("DefiPlatform Contract deployed to :", defiplatform.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
