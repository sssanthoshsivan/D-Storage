// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// using chainlink price feed for matic/usd price
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FileStorage {
    address payable public owner;
    uint256 public uploadFee;
    address public priceFeedAddress;

    mapping(address => File[]) public usersFiles;

    event FileAdded(address indexed user, string fileName);

    struct File {
        string name;
        uint256 size;
        string uri;
        uint256 uploadDate;
    }

    constructor(address _priceFeedAddress) {
        priceFeedAddress = _priceFeedAddress;
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can use this");
        _;
    }

    // allow owner to set new listing fee in $
    // fee is automatically converted from $ to MATIC using chainlink price feed
    function setListingFee(uint256 _fee) public onlyOwner {
        (uint256 price, uint256 decimals) = getMaticUsdPrice();
        uploadFee = (_fee * 10**decimals) / price;
    }

    function getListingFee() public view returns (uint256) {
        return uploadFee;
    }

    // Get matic/usd price from chainlink price feed
    function getMaticUsdPrice() internal returns (uint256, uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = priceFeed.decimals();
        return (uint256(price), decimals);
    }

    function uploadFile(
        string memory _name,
        uint256 _size,
        string memory fileURI
    ) public payable {
        require(
            msg.value == uploadFee,
            "To upload file you need to pay the fee"
        );

        File memory newFile = File(_name, _size, fileURI, block.timestamp);
        usersFiles[msg.sender].push(newFile);

        emit FileAdded(msg.sender, _name);

        // pay owner upload fee
        owner.transfer(msg.value);
    }

    // view function to return all user uploaded files
    function getUserFiles(address _user) public view returns (File[] memory) {
        require(msg.sender == _user, "only user can check his own files");
        return usersFiles[_user];
    }
}
