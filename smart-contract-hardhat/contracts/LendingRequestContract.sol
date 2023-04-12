// SPDX-License-Identifier: DEFI

pragma solidity 0.8.11; // Solidity compiler version
import "hardhat/console.sol"; // Hardhat console logs
import "./ERC20Interface.sol"; // ERC20 Interface

/**
 * @title LendingRequest
 * @dev Implementation contract for a new Lending Request.
 *      Every new token ask from a lesee will create a new instance of this contract.
 * @dev Not Upgradable
 */
contract LendingRequest {

    // State Variables
    address payable private owner; // Address of owner contract that is allowed to operate this contract
    address payable private token; // Address of ERC20 token contract that is being asked for in this request
    address payable public asker; // Eth address of the asker
    address payable public lender; // Eth address of the lender (if any)
    uint256 public collateral; // Amount of collateral (as ethers) being deposited as surety for this request
    uint256 public amountAsked; // Amount of tokens being asked for
    uint256 public paybackAmount; // Amount of tokens being promised to be returned
    string public purpose; // Purpose of asking for this loan
    uint256 public collateralCollectionTimeStamp; // Time after which collateral can be collected by lender if loan not settled

    bool public moneyLent; // Global state showing whether token was lent
    bool public debtSettled; // Global state showing whether token was returned
    bool public collateralCollected; // Global state showing whether collateral was collected by lender


    constructor(
        address payable _asker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _owner,
        address payable _token,
        uint256 _collateral,
        uint256 _collateralCollectionTimeStamp
    ) payable {
        asker = _asker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        purpose = _purpose;
        owner = _owner;
        token = _token;
        collateral = _collateral;
        collateralCollectionTimeStamp = _collateralCollectionTimeStamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorised access");
        _;
    }

    /**
     * @notice Transfer the amount of tokens being asked for from lender's to asker's account.
     * @notice Lender must have previously given this contract account enough allowance to transfer tokens on their behalf
     * @param _lender the address of the initial caller of the function
     * @return success true on success - false otherwise
     */
    function lend(address payable _lender) external onlyOwner returns (bool success) {
        /*
        A lender has decided to sponsor this loan request
        checks:
            must not have been lent already (!moneyLent)
            must not have been defaulted and collateral collected already
            must not be sponsored by the lender themselves
            lender must have given this contract enough allowance to transfer tokens on their behalf
         */
        // Check
        require(_lender != asker, "Invalid Lender");
        require(!moneyLent, "Money Already Lent");
        require(!collateralCollected, "Collateral Already Collected or Request Cancelled");

        // Check balance
        uint balance = ERC20Interface(token).allowance(_lender, address(this));
        require(balance >= amountAsked, "Balance is less than asked amount");

        // Transfer token
        require(ERC20Interface(token).transferFrom(_lender, asker, amountAsked), "Transfer Failed");

        // Set Data
        moneyLent = true;
        lender = _lender;

        // return
        return true;

    }

    /**
     * @notice Transfer the amount of promised payback tokens from asker's account to lender's account.
     * @notice Also return any collateral deposited by asker back to their account.
     * @param _asker the address of the initial caller of the function
     * @return success true on success - false otherwise
     */
    function payback(address payable _asker) external onlyOwner returns (bool success) {
        /*
        Asker pays back the loan
        checks:
            cannot pay back the debt if money has yet to be lent
            must not be paid back twice
            must not have already defaulted and collateral collected by lender
            has to be paid back only by the asker
            Asker must have given enough allowance to this contract to transfer tokens to lender on their behalf
         */

        // Checks
        require(_asker == asker, "Invalid Asker");
        require(moneyLent && !debtSettled, "Operation Not Permitted");
        require(!collateralCollected, "Collateral already collected" );

        // Check balance
        uint balance = ERC20Interface(token).allowance(_asker, address(this));
        require(balance >= paybackAmount, "Insufficient Balance");

        // Transfer token
        require(ERC20Interface(token).transferFrom(_asker, lender, paybackAmount), "Transfer Failed");

        // Remove collateral
        collateral -= address(this).balance;
        _asker.transfer(address(this).balance);

        // Set Data
        debtSettled = true;

        // return
        return true;

    }

    /**
     * @notice Collect any collateral deposited by asker if they default on payback
     * @param _lender address of the initial caller of this function
     * @return success true on success - false otherwise
     */
    function collectCollateral(address payable _lender) external onlyOwner returns (bool success){

        /*
        Lender collects the collateral deposited by asker on default
        checks:
            Only the lender can collect collateral
            Tokens must have already been lent
            Loan must not already have been paid back
            Collateral must only be collected once
            Deadline for payback must have passed
         */

        // Check
        require(_lender == lender, "Invalid Lender");
        require(moneyLent == true && debtSettled == false, "Money Not Lent");

        // Check Collateral
        require(!collateralCollected, "Collateral already collected" );
        require(block.timestamp >= collateralCollectionTimeStamp, "Too soon to collect collteral");

        // Update State
        collateralCollected = true;

        // Transfer ether
        _lender.transfer(address(this).balance);

        // returns
        return true;
    }

    /**
     * @notice cancels the request if possible
     */
    function cancelRequest(address _asker) external onlyOwner returns (bool success){

        /*
        Asker decides to cancel this loan request before anyone has executed it
        checks:
            Only the asker can cancel this request
            Tokens must not have already been lent
            Loan must not already have been paid back
            Collateral must not already have been collected
         */

        // Check
        require(_asker == asker, "Invalid Asker");
        require(moneyLent == false && debtSettled == false && collateralCollected == false, "Can not cancel now");

        // Update State
        collateralCollected = true;

        // Transfer Ether back
        asker.transfer(address(this).balance);

        // returns
        return true;
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestParameters() external onlyOwner view returns (address payable, address payable, uint256, uint256, string memory) {
        return (asker, lender, amountAsked, paybackAmount, purpose);
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestState() external onlyOwner view returns (bool, bool, uint256, bool, uint256, uint256) {
        return (moneyLent, debtSettled, collateral, collateralCollected, collateralCollectionTimeStamp, block.timestamp);
    }

}
