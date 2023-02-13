// SPDX-License-Identifier: DEFI

pragma solidity 0.8.11; // Solidity compiler version
import "hardhat/console.sol"; // Hardhat console logs
import "./GovernanceContract.sol";
import "./RequestFactoryAbstract.sol";
import "./LendingRequestContract.sol";

/**
 * @title DefiPlatform
 * @dev Implementation contract for a user accessible functions to ask, lend, payback, default on any token.
 *      This contract is a wrapper for triggering existing functions in other logic contracts already deployed
 * @dev Not Upgradable
 */
contract DefiPlatform is RequestFactory {

    // Events
    event LoanAsked();
    event LoanGiven();
    event LoanReturned();
    event LoanDefaulted();
    event LoanAskCancelled();

    // State mapping
    address[] private lendingRequests;
    mapping(address => uint256) private requestIndex;
    mapping(address => uint256) private userRequestCount;
    mapping(address => bool) private validRequest;

    // State Variables
    address private governance;

    constructor(address _governance) {
        governance = _governance;
    }

    /**
     * @notice Creates a lending request contract for the token amount you specified
     * @param _amount the amount you want to borrow in Wei
     * @param _paybackAmount the amount you are willing to pay back - has to be greater than _amount
     * @param _purpose the reason you want to borrow ether
     */
    function ask(uint256 _amount, uint256 _paybackAmount, string memory _purpose, address payable _token, uint256 _collateralCollectionTimeStamp) external payable returns(bool success){

        // Get if valid
        bool isPlatformEnabled = Governance(governance).isPlatformEnabled();
        require(isPlatformEnabled, "New Loan Requests are currently disabled");

        // validate the input parameters
        require(_amount > 0, "Amount of tokens requested should be greater than 0");
        require(_paybackAmount > _amount, "Payback amount should be greater than requested amount");

        // Check if collateral is being deposited in ethers
        require(msg.value > 0, "Some ether collateral must be included in your ask request");

        // Create new lendingRequest contract
        address payable requestContract = createLendingRequest(
            _amount,
            _paybackAmount,
            _purpose,
            payable(msg.sender),
            _token,
            msg.value,
            _collateralCollectionTimeStamp
        );

        // update number of requests for asker
        userRequestCount[msg.sender]++;

        // add created lendingRequest to management structures
        requestIndex[requestContract] = lendingRequests.length;
        lendingRequests.push(requestContract);

        // mark created lendingRequest as a valid request
        validRequest[requestContract] = true;

        emit LoanAsked();

        return true;
    }

    /**
     * @notice Lend tokens asked for in any specific lendingRequest contract
     * @notice The amount of tokens will be transferred from your account to askers account. You must have already given allowance to this lendingRequest contract to transfer on your behalf.
     * @param _requestContractAddress the address of the lendingRequest contract you want to execute and lend tokens to
     */
    function lend(address payable _requestContractAddress) external returns(bool result) {

        // Check is there is a valid lending contract at that address
        require(validRequest[_requestContractAddress], "Invalid Request Contract");

        bool success = LendingRequest(_requestContractAddress).lend(payable(msg.sender));
        require(success, "Lending failed");

        // Emit Event
        emit LoanGiven();

        return true;
    }

    /**
     * @notice payback the loaned tokens to lender
     * @param _requestContractAddress the address of the lendingRequest contract you want to payback debt of
     */
    function payback(address payable _requestContractAddress) external returns(bool result) {

        // Checks
        require(validRequest[_requestContractAddress], "Invalid Request Contract");

        bool success = LendingRequest(_requestContractAddress).payback(payable(msg.sender));
        require(success, "Payback failed");

        // Emit Event
        emit LoanReturned();

        return true;
    }

    /**
     * @notice collect collateral deposited by asker on default
     * @param _requestContractAddress the address of the lendingRequest contract you want to payback debt of
     */
    function collectColletral(address payable _requestContractAddress) external returns(bool result) {

        // Checks
        require(validRequest[_requestContractAddress], "Invalid Request Contract");

        bool success = LendingRequest(_requestContractAddress).collectCollateral(payable(msg.sender));
        require(success, "collectCollateral failed");

        // Emit Event
        emit LoanDefaulted();

        return true;

    }

    /**
     * @notice cancels the loan request
     * @param _requestContractAddress the address of the request to cancel
     */
    function cancelRequest(address payable _requestContractAddress) external returns(bool result) {

        // validate input
        require(validRequest[_requestContractAddress], "Invalid Request Contract");

        bool success = LendingRequest(_requestContractAddress).cancelRequest(msg.sender);
        require(success, "cancelRequest failed");

        // Remove Request
        removeRequest(_requestContractAddress, msg.sender);

        emit LoanAskCancelled();

        return true;
    }

    /**
     * @notice removes the requestContractAddress from mapping storage
     * @param _requestContractAddress the lendingRequest contract that will be removed
     * @param _asker address of the asker cancelling this request
     */
    function removeRequest(address _requestContractAddress, address _asker) private {

        // update number of requests for asker
        userRequestCount[_asker]--;

        // remove _requestContractAddress from the contract storage
        // Step 1 - Get array's index of this particular request from our index mapping
        uint256 idx = requestIndex[_requestContractAddress];
        // Step 2 - Verify if the request at this index in the array is the correct request
        if (lendingRequests[idx] == _requestContractAddress) {
            // Step 3 - Overwrite the request at this index with a copy of the request at the top of the array
            // This effectively removes this request but there are now 2 copies of the topmost request in the array
            requestIndex[lendingRequests[lendingRequests.length - 1]] = idx;
            lendingRequests[idx] = lendingRequests[lendingRequests.length - 1];
            // Step 4 - Remove the request at the top of the array as it has now safely been copied to another location in the array
            lendingRequests.pop();
        }
        // mark _requestContractAddress as invalid lendingRequest
        validRequest[_requestContractAddress] = false;

    }


    function getRequestParameters(address payable _requestContractAddress) external view returns (address asker, address lender, uint256 askAmount, uint256 paybackAmount,string memory purpose) {
        (asker, lender, askAmount, paybackAmount, purpose) = LendingRequest(_requestContractAddress).getRequestParameters();
    }

    function getRequestState(address payable _requestContractAddress) external view returns (bool moneyLent, bool debtSettled, uint256 collateral, bool collateralCollected, uint256 collateralCollectionTimeStamp, uint256 currentTimeStamp) {
        return LendingRequest(_requestContractAddress).getRequestState();
    }

    function getCollateralBalance(address _requestContractAddress) external view returns(uint256) {
        return address(_requestContractAddress).balance;
    }

    /**
     * @notice gets a list of all available lending requests created on this platform
     * @return all lendingRequests
     */
    function getRequests() external view returns(address[] memory) {
        return lendingRequests;
    }


}