//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectTed is ERC721URIStorage, Ownable {

    error InvalidTokenID();

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
        if (!validId(tokenId))
            revert InvalidTokenID();
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
