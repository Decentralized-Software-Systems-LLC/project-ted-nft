const hre = require("hardhat");

async function main() {
  const ProjectTedContract = await hre.ethers.getContractFactory("ProjectTed");
  const ProjectTed = await ProjectTedContract.attach("");
  [owner] = await hre.ethers.getSigners();

  console.log("Owner address:", owner.address);
  console.log("ProjectTed name:", await ProjectTed.name());
  console.log("ProjectTed symbol:", await ProjectTed.symbol());
  await ProjectTed.mintNFT(owner.address, "ipfs://", 11111);  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
