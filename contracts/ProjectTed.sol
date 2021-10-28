//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectTed is ERC721URIStorage, Ownable {

    constructor() ERC721("Project Ted", "TED") {}

    function validId(uint tokenId) public pure returns (bool) {
        return tokenId >= 11111 && tokenId <= 55555
            && tokenId % 10 > 0 && tokenId % 10 <= 5
            && tokenId % 100 > 10 && tokenId % 100 <= 55
            && tokenId % 1000 > 100 && tokenId % 1000 <= 555
            && tokenId % 10000 > 1000 && tokenId % 10000 <= 5555;
    } 

    function mintNFT(address recipient, string memory tokenURI, uint tokenId)
        public onlyOwner
    {
        string memory invalidId = "Invalid ID";
        require(validId(tokenId), invalidId);
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function mintMultipleNFT(address recipient, string[] memory tokenURIs, uint256[] memory tokenIds)
        public onlyOwner
    {
        require(tokenURIs.length == tokenIds.length, "tokenIds and tokenURIs length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            mintNFT(recipient, tokenURIs[i], tokenIds[i]);
        }
    }
}
