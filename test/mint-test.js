const { expect } = require("chai");
const { ethers } = require("hardhat");
const { validIds: validIdsArray, invalidIds: invalidIdsArray, algorithm } = require("./testingIds.js");

describe("Token ID Algorithm", function () {

  it("should have the correct total of IDs", async function () {
    expect(validIdsArray.length).to.equal(3125);
    expect(invalidIdsArray.length).to.equal(41320);
  });

  it("should return true for valid IDs", async function () {
    for (let i in validIdsArray) {
      expect(algorithm(validIdsArray[i])).to.be.true;
    }
  });

  it("should return false for invalid IDs", async function () {
    for (let i in invalidIdsArray) {
      expect(algorithm(invalidIdsArray[i])).to.be.false;
    }
  });
});

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

  it("should return true for valid IDs", async function () {
    let validIds = [
      11111,
      22222,
      12345
    ]
    for (let i in validIds) {
      expect(await ProjectTed.validId(validIds[i])).to.be.true;
    }
  });

  it("should return false for invalid IDs", async function () {
    let invalidIds = [
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
    for (let i in invalidIds) {
      expect(await ProjectTed.validId(invalidIds[i])).to.be.false;
    }
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

  it("should mint multiple", async function () {
    let tokenUris = [];
    let tokenIds = [];
    for(let i = 21111; i <= 21115; i++) {
      tokenIds.push(i);
      tokenUris.push("https://bighappyface.io/" + i);
    }
    await ProjectTed.mintMultipleNFT(owner.address, tokenUris, tokenIds);
    expect(await ProjectTed.tokenURI(21111)).to.equal(tokenUris[0]);
    expect(await ProjectTed.tokenURI(21112)).to.equal(tokenUris[1]);
    expect(await ProjectTed.tokenURI(21113)).to.equal(tokenUris[2]);
    expect(await ProjectTed.tokenURI(21114)).to.equal(tokenUris[3]);
    expect(await ProjectTed.tokenURI(21115)).to.equal(tokenUris[4]);
  });
});

describe("ProjectTed1155", function () {
  // Declare common variables
  let owner, secondAddress, ProjectTedContract, ProjectTed;

  before(async function () {

    // Get signers of local chain
    [owner, secondAddress] = await ethers.getSigners();

    // Deploy contract instance
    ProjectTedContract = await ethers.getContractFactory("ProjectTed1155");
    ProjectTed = await ProjectTedContract.deploy();
    await ProjectTed.deployed();
  });

  it("should mint one", async function () {
    let tokenUri = "https://bighappyface.io/ted/{id}.json";
    let emptyByteString = ethers.utils.formatBytes32String("");
    
    await ProjectTed.mint(owner.address, 11111, 1, emptyByteString);
    expect(await ProjectTed.balanceOf(owner.address, 11111)).to.equal(1);
    expect(await ProjectTed.uri(11111)).to.equal(tokenUri);
  });

  it("should mint many", async function () {
    let tokenUri = "https://bighappyface.io/ted/{id}.json";
    let emptyByteString = ethers.utils.formatBytes32String("");
    let ids = [], amounts = [];
    for (let i = 11112; i <= 11115; i++) {
      ids.push(i); amounts.push(1);
    }
    await ProjectTed.mintBatch(owner.address, ids, amounts, emptyByteString);
    
    expect(await ProjectTed.balanceOf(owner.address, 11112)).to.equal(1);
    expect(await ProjectTed.balanceOf(owner.address, 11113)).to.equal(1);
  });

  it("should transfer", async function () {
    let emptyByteString = ethers.utils.formatBytes32String("");
    await ProjectTed.safeTransferFrom(owner.address, secondAddress.address, 11111, 1, emptyByteString);
    expect(await ProjectTed.balanceOf(secondAddress.address, 11111)).to.equal(1);
  });

  it("should not transfer if not owner or approved", async function () {
    let emptyByteString = ethers.utils.formatBytes32String("");
    await expect(
      ProjectTed.safeTransferFrom(owner.address, secondAddress.address, 11111, 1, emptyByteString)
    ).to.be.revertedWith("insufficient balance");
  });
});