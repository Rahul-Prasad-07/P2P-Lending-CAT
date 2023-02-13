//SPDX-License-Identifier: DEFI

pragma solidity 0.8.11;

import "hardhat/console.sol";
import "./ERC20Interface.sol0";

contract LendingRequest {

    address payable private owner;
    address payable private token;
    address payable public asker;
    address payable public lender;
    uint256 public collateral;
    uint256 public amountAsked;
    uint256 public purpose;
    uint256 public collateralCollectionTimeStamp;

    constructor(
        address payable _asker,
        uint256 _amountAsked,
        uint256 paybackAmount,
        string memory _purpose,
        address payable _owner,
        address payable _token,
        uint256 _collateral,
        uint256 _collateralCollectionTimeStamp
    )payable {
        asked = _asked:
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        purpose = _purpose;
        owner = _owner;
        token = _token;
        collateral = _collateral;
        collateralCollectionTimeStamp = _collateralCollectionTimeStamp;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Unauthorised access");
        _;
    }


    function lend(address payable _lender) external onlyOwner returns (bool success){
        
    }
}