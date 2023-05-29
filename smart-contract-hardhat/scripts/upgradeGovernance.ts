// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {ethers, upgrades} from "hardhat";

async function upgrade() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');
	
	const GOVERNANCE_ADDRESS = "0x59d2A51AFd90acC87C0bf70210D10A924F583BE4"; // upgraded address
	
	// 1. Upgrade Governance Contract
	const GovernanceV2 = await ethers.getContractFactory("Governance");
	const governance = await upgrades.upgradeProxy(GOVERNANCE_ADDRESS, GovernanceV2);
	
	console.log("Governance Contract Upgraded. Contract address is: ", governance.address);
	
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
upgrade().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});