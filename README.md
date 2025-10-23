# HackNFT - Hackathon Project NFT Minting Platform

A decentralized platform for minting hackathon projects as NFTs on Polygon with IPFS metadata storage.

## Project info

**URL**: https://lovable.dev/projects/26702f01-0171-45dd-a071-0b6fd933d1cf

## Features

### Smart Contract (HackNFT.sol)
- ✅ **ERC-721 NFT Standard** - Fully compliant NFT implementation
- ✅ **Free Minting** - No gas fees for minting (only network fees)
- ✅ **Transfer Functionality** - NFTs can be transferred between wallets
- ✅ **Duplicate Prevention** - Prevents same project from being minted twice
- ✅ **On-chain Metadata** - Stores project name, team, GitHub URL, and creator
- ✅ **IPFS Integration** - Token URI points to IPFS metadata

### Frontend Features
- 🎨 **Modern UI** - Built with React, TypeScript, and shadcn/ui
- 📤 **IPFS Upload** - Direct upload to Pinata for images and metadata
- 🖼️ **Image Preview** - Real-time preview of uploaded project images
- 🔗 **Wallet Integration** - MetaMask connection via wagmi
- 📊 **Form Validation** - Complete project submission form
- ✨ **Loading States** - Clear feedback during upload and minting

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/26702f01-0171-45dd-a071-0b6fd933d1cf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library

### Smart Contract
- **Solidity ^0.8.20** - Smart contract language
- **OpenZeppelin Contracts** - Secure, audited contract libraries
- **Hardhat** - Ethereum development environment

### Storage
- **Pinata** - IPFS pinning service for decentralized storage
- **IPFS** - Distributed file storage

## Environment Setup

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Pinata API Keys for IPFS uploads
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

**Get Pinata API Keys:**
1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create a new API key with pinning permissions
4. Copy the API Key and Secret Key to your `.env` file

### 2. Smart Contract Deployment

Navigate to the contracts directory and deploy:

```bash
cd contracts
npm install

# Deploy to Polygon Amoy testnet
npx hardhat run scripts/deploy.js --network amoy
```

Update the contract address in `src/config/contract.ts`

### 3. Run the Application

```bash
npm install
npm run dev
```

## How to Use

### Minting an NFT

1. **Connect Wallet** - Click "Connect Wallet" and approve MetaMask connection
2. **Fill Project Details**:
   - Project Name (required)
   - Team Name (required)
   - Description (required)
   - GitHub Repository URL (required)
   - Demo URL (optional)
   - Tags (optional)
   - Team Members (optional)
   - Project Image (optional)
3. **Upload to IPFS** - Click "Submit Project & Mint NFT"
   - Image uploads to IPFS via Pinata
   - Metadata uploads to IPFS
4. **Confirm Transaction** - Approve the transaction in MetaMask
5. **Success!** - Your NFT is minted and visible on OpenSea

### Transferring NFTs

NFTs can be transferred using:
- **OpenSea** - Use the "Transfer" button on your NFT page
- **MetaMask** - Send NFT from your wallet
- **Smart Contract** - Call `transferFrom()` or `safeTransferFrom()` functions

## Smart Contract Functions

### Public Functions

```solidity
// Mint a new project NFT
function mintProject(
    string memory projectName,
    string memory teamName,
    string memory githubUrl,
    string memory tokenURI
) public returns (uint256)

// Transfer NFT
function transferFrom(address from, address to, uint256 tokenId) public
function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public

// View functions
function getProjectMetadata(uint256 tokenId) public view returns (ProjectMetadata memory)
function isProjectMinted(string memory projectName, string memory teamName, string memory githubUrl) public view returns (bool)
function totalSupply() public view returns (uint256)
function ownerOf(uint256 tokenId) public view returns (address)
function balanceOf(address owner) public view returns (uint256)
```

## Project Structure

```
├── contracts/              # Smart contracts
│   ├── HackNFT.sol        # Main NFT contract
│   └── package.json       # Contract dependencies
├── src/
│   ├── components/        # React components
│   ├── config/           # Contract ABI and addresses
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   └── Submit.tsx    # NFT minting form
│   └── main.tsx          # App entry point
├── .env                   # Environment variables
└── package.json          # Frontend dependencies
```

## How can I deploy this project?

### Frontend Deployment

Simply open [Lovable](https://lovable.dev/projects/26702f01-0171-45dd-a071-0b6fd933d1cf) and click on Share -> Publish.

Or deploy manually:
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Smart Contract Deployment

See "Environment Setup" section above for contract deployment instructions.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
