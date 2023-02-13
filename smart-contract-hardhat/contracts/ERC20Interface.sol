// SPDX-License-Identifier: DEFI

pragma solidity 0.8.11; // Solidity compiler version

import "hardhat/console.sol"; // Hardhat console logs
import "./ERC20Interface.sol"; // ERC20 Interface



// This interface functionalities will be used in other smart contract by ingerting it.

interface ERC20Interface {

    //balanceof --> to check the balance of owner 
    //transfer --> Transfer balance from one account to another 
    //trnasferFrom --> Transfer amount from X to Y vai third party.for that first owner has "approve' that account address to be able to do a transfer.
    //Allownace --> to check the balance is greater than the value the spender wants to transfer.
    

    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender,uint256 _value) external returns (bool success);
    function alllownace(address _owner, address _spender) external view returns (uint256 remaining);

    //events will trigger when  transfer and approval function will call

    event Transfer(address indexed_from, address indexed_to, uint256 _value);
    event Approval(address indexed _owner, address indexed_spender, uint256 _value);
    
    
    
    }
