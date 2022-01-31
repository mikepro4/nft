// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract NFT is ERC721URIStorage {
//     using Counters for Counters.Counter;

//     Counters.Counter private _tokenIds;
//     // counter allow us to keep track of token ids

//     address contractAddress;

//     function baseTokenURI() public pure returns (string memory) {
//         return "https://creatures-api.opensea.io/api/creature/";
//     }

//     function contractURI() public pure returns (string memory) {
//         return "https://creatures-api.opensea.io/contract/opensea-creatures";
//     }

//     constructor(address _proxyRegistryAddress) ERC721("Ethereal Shapes", "ETHS") {
//         contractAddress = _proxyRegistryAddress;
//     }

//     function mintToken(string memory tokenURI) public returns(uint256) {
//         _tokenIds.increment();
//         uint256 newItemId = _tokenIds.current();
//         _mint(msg.sender, newItemId);
//         _setTokenURI(newItemId, tokenURI);
//         setApprovalForAll(contractAddress, true);
//         return newItemId;
//     }

//     function transferFrom(
//         address from,
//         address to,
//         uint256 tokenId
//     ) public virtual override {

//     }


// }

