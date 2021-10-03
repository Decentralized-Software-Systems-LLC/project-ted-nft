const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectTed", function () {
  // Declare common variables
  let owner, secondAddress, ProjectTedContract, ProjectTed;

  before(async function () {

    // Get signers of local chain
    [owner, secondAddress] = await ethers.getSigners();

    // Deploy contract instance
    ProjectTedContract = await ethers.getContractFactory("ProjectTed");
    ProjectTed = await ProjectTedContract.deploy();
    await ProjectTed.deployed();

  });

  it("should mint", async function () {
    let tokenUri = "https://bighappyface.io/a";
    await ProjectTed.mintNFT(owner.address, tokenUri, 11111);
    expect(await ProjectTed.tokenURI(11111)).to.equal(tokenUri);

    await ProjectTed.mintNFT(owner.address, tokenUri, 22222);
    expect(await ProjectTed.tokenURI(22222)).to.equal(tokenUri);

    await ProjectTed.mintNFT(owner.address, tokenUri, 33333);
    expect(await ProjectTed.tokenURI(33333)).to.equal(tokenUri);

    await ProjectTed.mintNFT(owner.address, tokenUri, 44444);
    expect(await ProjectTed.tokenURI(44444)).to.equal(tokenUri);

    await ProjectTed.mintNFT(owner.address, tokenUri, 55555);
    expect(await ProjectTed.tokenURI(55555)).to.equal(tokenUri);
  });

  it("should not mint with a bad ID", async function () {
    let tokenUri = "https://bighappyface.io/a";
    let msg = "Invalid ID";
    let badIds = [
      11110, // Lower bound
      55556, // Upper bound
      11116, // Ones
      11120, // Ones
      11161, // Tens
      11201, // Tens
      11611, // Hundreds
      12011, // Hundreds
      16111, // Thousands
      20111, // Thousands
      20000, // Zeros
    ]
    for (let i in badIds) {
      await expect(
        ProjectTed.mintNFT(owner.address, tokenUri, badIds[i])
      ).to.be.revertedWith(msg);
    }
  });

  it("should transfer", async function () {
    await ProjectTed.transferFrom(owner.address, secondAddress.address, 11111);
    expect(await ProjectTed.ownerOf(11111)).to.equal(secondAddress.address);
  });

  it("should not transfer if not owner or approved", async function () {
    await expect(
      ProjectTed.transferFrom(owner.address, secondAddress.address, 11111)
    ).to.be.revertedWith("transfer caller is not owner nor approved");
  });
});
