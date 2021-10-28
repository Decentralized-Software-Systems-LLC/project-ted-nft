const hre = require("hardhat");

async function main() {
  const ProjectTedContract = await hre.ethers.getContractFactory("ProjectTed");
  const ProjectTed = await ProjectTedContract.deploy();

  await ProjectTed.deployed();

  console.log("ProjectTed deployed to:", ProjectTed.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
