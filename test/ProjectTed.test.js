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
  let tokenUri = "ipfs://QmXmjY1bFMuH5fCGbZ8CHd8fFWzJRZxTKQo7aievy7LUou/{id}.json";

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
      10,    // Small
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
      20000000000, // Large
    ]
    for (let i in invalidIds) {
      expect(await ProjectTed.validId(invalidIds[i])).to.be.false;
    }
  });

  it("should mint for the owner", async function () {
    await ProjectTed.ownerMint(11111);
    expect(await ProjectTed.tokenURI(11111)).to.equal(tokenUri);
  });

  it("should not mint with a bad ID", async function () {
    let msg = "InvalidTokenID";
    let badIds = [
      11110, // Lower bound
    ]
    for (let i in badIds) {
      await expect(
        ProjectTed.ownerMint(badIds[i])
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

  it("should mint for the public", async function () {
    let payment = ethers.utils.parseEther(".02");
    let overrides = {
      value: payment
    };
    let oldBalance = await secondAddress.getBalance();
    await ProjectTed.connect(secondAddress).publicMint(44332, overrides);
    expect(await ProjectTed.tokenURI(44332)).to.equal(tokenUri);
    expect(await ProjectTed.ownerOf(44332)).to.equal(secondAddress.address);
    let newBalance = await secondAddress.getBalance();
    expect(oldBalance.sub(newBalance).sub(payment) < payment).to.be.true;
  });

  it("should withdraw to owner", async function () {
    let oldBalance = await owner.getBalance();
    await ProjectTed.withdraw();
    let newBalance = await owner.getBalance();
    expect(newBalance.sub(oldBalance) > 0).to.be.true;
  });

  it("should not withdraw if not owner", async function () {
    await expect(
      ProjectTed.connect(secondAddress).withdraw()
    ).to.be.revertedWith("caller is not the owner");
  });
});

xdescribe("ProjectTed1155", function () {
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