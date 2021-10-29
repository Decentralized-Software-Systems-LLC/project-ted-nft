//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectTed is ERC721URIStorage, Ownable {

    uint256 constant TOKEN_PRICE = .02 ether;
    string constant TOKEN_URI = "{id}.json";

    error InvalidTokenID();

    error InvalidPayment();

    constructor() ERC721("Project Ted", "TED") {}

    /**
     * @dev See {IERC721-approve}.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmXmjY1bFMuH5fCGbZ8CHd8fFWzJRZxTKQo7aievy7LUou/";
    }

    function validId(uint tokenId) public pure returns (bool) {
        return tokenId >= 11111 && tokenId <= 55555
            && tokenId % 10 > 0 && tokenId % 10 <= 5
            && tokenId % 100 > 10 && tokenId % 100 <= 55
            && tokenId % 1000 > 100 && tokenId % 1000 <= 555
            && tokenId % 10000 > 1000 && tokenId % 10000 <= 5555;
    }

    function ownerMint(uint tokenId)
        public onlyOwner
    {
        if (!validId(tokenId))
            revert InvalidTokenID();

        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, TOKEN_URI);
    }

    function publicMint(uint tokenId) public payable {
        if (msg.value < TOKEN_PRICE)
            revert InvalidPayment();
            
        if (!validId(tokenId))
            revert InvalidTokenID();
            
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, TOKEN_URI);
    }
   
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
