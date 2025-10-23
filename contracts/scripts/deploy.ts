import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  console.log("\n🚀 Deploying HackNFT contract...");
  console.log("Network:", hre.network.name);

  const hackNFT = await hre.viem.deployContract("HackNFT");
  
  console.log("✅ HackNFT deployed to:", hackNFT.address);
  console.log("\n📝 Update this address in src/config/contract.ts:");
  console.log(`   HACKNFT_ADDRESS: "${hackNFT.address}"`);
  console.log("\n🔗 View on PolygonScan:");
  console.log(`   https://amoy.polygonscan.com/address/${hackNFT.address}`);
  
  console.log("\n⏳ Waiting for confirmations...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log("\n✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
