// SPDX-License-Identifier: DEFI

pragma solidity 0.8.11; // Solidity compiler version
import "hardhat/console.sol"; // Hardhat console logs
import "./LendingRequestContract.sol";

/**
 * @title RequestFactory
 * @dev Implementation contract for dynamically deploying new lending smart contracts
 * @dev Not Upgradable
 */
abstract contract RequestFactory {

    /**
     * @notice deploys a new lendingRequest smart contract
     * @param _amount the amount the asker wants to borrow
     * @param _paybackAmount the amount the asker is willing to pay back to the lender
     * @param _purpose the reason the asker wants to borrow tokens
     * @param _origin origin address of the call -> address of the asker
     * @param _token address of token contract that is being asked for
     * @param _collateral amount of wei being deposited as collateral
     * @param _collateralCollectionTimeStamp timestamp in unix seconds for deadline of loan payback
     * @return lendingRequest address of the new lending contract being deployed
     */
    function createLendingRequest (
        uint256 _amount,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _origin,
        address payable _token,
        uint256 _collateral,
        uint256 _collateralCollectionTimeStamp
    ) internal returns (address payable lendingRequest) {

        // create new instance of lendingRequest contract
        return lendingRequest = payable(address(uint160(address(
                new LendingRequest{value: msg.value}(
                    _origin,
                    _amount,
                    _paybackAmount,
                    _purpose,
                    payable(address(this)),
                    _token,
                    _collateral,
                    _collateralCollectionTimeStamp
                )
            ))));
    }
}
