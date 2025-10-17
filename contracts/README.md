# HackNFT Smart Contract

## Overview
ERC-721 NFT contract for minting hackathon project NFTs on Polygon. Each NFT represents a verified hackathon project with on-chain metadata.

## Features
- **Free Minting**: No gas fees for minters (only deployer pays)
- **Duplicate Prevention**: Each project can only be minted once
- **On-Chain Metadata**: Project details stored directly on blockchain
- **ERC-6551 Compatible**: Ready for Token-Bound Account upgrades

## Deployment Instructions

### Prerequisites
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

### 1. Initialize Hardhat
```bash
npx hardhat init
```

### 2. Configure Hardhat (hardhat.config.js)
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
```

### 3. Create Deployment Script (scripts/deploy.js)
```javascript
const hre = require("hardhat");

async function main() {
  const HackNFT = await hre.ethers.getContractFactory("HackNFT");
  const hackNFT = await HackNFT.deploy();
  await hackNFT.waitForDeployment();

  const address = await hackNFT.getAddress();
  console.log("HackNFT deployed to:", address);
  
  // Wait for block confirmations
  await hackNFT.deploymentTransaction().wait(5);
  
  // Verify contract
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Deploy to Polygon Amoy (Testnet)
```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

### 5. Deploy to Polygon Mainnet
```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Environment Variables
Create a `.env` file:
```
PRIVATE_KEY=your_wallet_private_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

## Contract Functions

### `mintProject(projectName, teamName, githubUrl, tokenURI)`
Free mint function for teams to create their project NFT.

### `getProjectMetadata(tokenId)`
Retrieve on-chain metadata for a specific project.

### `isProjectMinted(projectName, teamName, githubUrl)`
Check if a project has already been minted.

### `totalSupply()`
Get total number of minted project NFTs.

## Frontend Integration
After deployment, update the contract address in `src/config/contract.ts`:
```typescript
export const HACKNFT_CONTRACT_ADDRESS = "0x..."; // Your deployed address
```

## ERC-6551 Upgrade Path
To enable Token-Bound Accounts for crowdfunding:
1. Deploy ERC-6551 Registry
2. Deploy Account Implementation
3. Create token-bound accounts for each NFT
4. NFTs can now hold and receive ERC-20 tokens

## Security Considerations
- Contract is Ownable (only owner can perform admin functions)
- Duplicate minting prevention via project hash
- Standard ERC-721 security features
- Consider auditing before mainnet deployment

## Gas Optimization
- Uses Counters library for efficient token ID tracking
- Minimal on-chain storage
- Efficient hash-based duplicate detection

## Testing
```bash
npx hardhat test
```

## Verification
After deployment, verify on PolygonScan for transparency:
```bash
npx hardhat verify --network polygonAmoy DEPLOYED_ADDRESS
```
