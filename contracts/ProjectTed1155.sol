//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract ProjectTed1155 is ERC1155PresetMinterPauser {

    constructor() ERC1155PresetMinterPauser("https://bighappyface.io/ted/{id}.json") {}
}
