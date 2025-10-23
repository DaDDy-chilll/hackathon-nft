import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HackNFTModule = buildModule("HackNFTModule", (m) => {
  const hackNFT = m.contract("HackNFT");
  
  return { hackNFT };
});

export default HackNFTModule;
