
const hre = require("hardhat");
const fs = require("fs");


async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("ESMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed()
  console.log("nft market deployed to: ", nftMarket.address)

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed()
  console.log("nft contract deployed to: ", nft.address)

  let config = `
  export const nftMarketAddress = "${nftMarket.address}"
  export const nftAddress = "${nft.address}"`;

//   const Shape = await hre.ethers.getContractFactory("Shape");
//   const shape = await Shape.deploy();
//   await nftMarket.deployed()
//   console.log("nft market deployed to: ", shape.address)


  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
