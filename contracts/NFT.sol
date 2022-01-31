//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    // counter allow us to keep track of token ids

    Counters.Counter private _tokenIds;
    // Counters.Counter private _marketTokenIds;
    // Counters.Counter private _markeTokensSold;

    // address payable owner;
    // uint256 listingPrice = 0.0 ether;

    address contractAddress;

    // // structs can act like objects

    // struct MarketToken {
    //     uint itemId;
    //     address nftContract;
    //     uint256 tokenId;
    //     address payable owner;
    //     uint256 price;
    //     bool onSale;
    // }

    // event MarketTokenMinted(
    //     uint indexed itemId,
    //     address indexed nftContract,
    //     uint indexed tokenId,
    //     address owner,
    //     uint256 price,
    //     bool sold
    // );

    // tokenId return which MarketToken - fetch which one it is
    // mapping(uint256 => MarketToken) private idToMarketToken;

    function baseTokenURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/api/creature/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/contract/opensea-creatures";
    }

    constructor(address _proxyRegistryAddress) ERC721("Ethereal Shapes", "ETHS") {
        contractAddress = _proxyRegistryAddress;
        // owner = payable(msg.sender);
    }

    function mintToken(string memory tokenURI) public returns(uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public virtual override {

    // }

    // create a market item to put it up for sale

//     function makeMarketItem(
//         address nftContract,
//         uint tokenId,
//         uint price
//     ) public payable nonReentrant {
//         require(price > 0, "Price at least 1 wei");
//         require(msg.value == listingPrice, "Price must be equal to listing price");

//         _tokenIds.increment();
//         uint itemId = _tokenIds.current();

//          // to create a market sale for buying and selling between parties

//         idToMarketToken[itemId] = MarketToken(
//             itemId,
//             nftContract,
//             tokenId,
//             payable(msg.sender),
//             price,
//             true
//         );

//         // NFT Transaction
//         // transferFrom(address(0), msg.sender, tokenId);

//         emit MarketTokenMinted(
//             itemId,
//             nftContract,
//             tokenId,
//             msg.sender,
//             price,
//             true
//         );

//         //function to conduct transaction and market sales

//     }

//     function fetchMyNFTs() public view returns(MarketToken[] memory) {
//         uint totalItemCount = _tokenIds.current();
//         uint itemCount = 0;
//         uint currentIndex = 0;

//         for(uint i = 0; i<totalItemCount; i++) {
//             if(idToMarketToken[i+1].owner == msg.sender) {
//                 itemCount += 1;
//             }
//         }

//         MarketToken[] memory items = new MarketToken[](itemCount);
//         for(uint i = 0; i < totalItemCount; i++) {
//             if(idToMarketToken[i+1].owner == msg.sender) {
//                 uint currentId = idToMarketToken[i+1].itemId;

//                 MarketToken storage currentItem = idToMarketToken[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }
}

