//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectTed is ERC721URIStorage, Ownable {

    constructor() ERC721("Project Ted", "TED") {}

    function mintNFT(address recipient, string memory tokenURI, uint256 tokenId)
        public onlyOwner
    {
        string memory invalidId = "Invalid ID";
        require(tokenId >= 11111 && tokenId <= 55555, invalidId);
        require(tokenId % 10 > 0 && tokenId % 10 <= 5, invalidId);
        require(tokenId % 100 > 10 && tokenId % 100 <= 55, invalidId);
        require(tokenId % 1000 > 100 && tokenId % 1000 <= 555, invalidId);
        require(tokenId % 10000 > 1000 && tokenId % 10000 <= 5555, invalidId);
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
