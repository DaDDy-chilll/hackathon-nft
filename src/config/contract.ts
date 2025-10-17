// Contract configuration for HackNFT
// Update these addresses after deploying the smart contract

export const CONTRACTS = {
  // Polygon Amoy Testnet
  AMOY: {
    HACKNFT_ADDRESS: "0x0000000000000000000000000000000000000000", // Replace with deployed address
    CHAIN_ID: 80002,
  },
  // Polygon Mainnet
  POLYGON: {
    HACKNFT_ADDRESS: "0x0000000000000000000000000000000000000000", // Replace with deployed address
    CHAIN_ID: 137,
  },
} as const;

// HackNFT Contract ABI (only the functions we need)
export const HACKNFT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "projectName", type: "string" },
      { internalType: "string", name: "teamName", type: "string" },
      { internalType: "string", name: "githubUrl", type: "string" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "mintProject",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getProjectMetadata",
    outputs: [
      {
        components: [
          { internalType: "string", name: "projectName", type: "string" },
          { internalType: "string", name: "teamName", type: "string" },
          { internalType: "string", name: "githubUrl", type: "string" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint256", name: "mintedAt", type: "uint256" },
        ],
        internalType: "struct HackNFT.ProjectMetadata",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "projectName", type: "string" },
      { internalType: "string", name: "teamName", type: "string" },
      { internalType: "string", name: "githubUrl", type: "string" },
    ],
    name: "isProjectMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "projectName", type: "string" },
      { indexed: false, internalType: "string", name: "teamName", type: "string" },
      { indexed: false, internalType: "bytes32", name: "projectHash", type: "bytes32" },
    ],
    name: "ProjectMinted",
    type: "event",
  },
] as const;
