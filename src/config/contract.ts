// Contract configuration for HackNFT
// Update these addresses after deploying the smart contract

export const CONTRACTS = {
  // Polygon Amoy Testnet
  AMOY: {
    HACKNFT_ADDRESS: "0x19f032FE0C9F5a563A699E473d9FDe0bd909Bf55", // Replace with deployed address
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
    inputs: [],
    name: "getAllTokenIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getTokensByOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "fundingGoal", type: "uint256" },
    ],
    name: "enableFunding",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "newGoal", type: "uint256" },
    ],
    name: "updateFundingGoal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "fundProject",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getFundingInfo",
    outputs: [
      { internalType: "uint256", name: "fundingGoal", type: "uint256" },
      { internalType: "uint256", name: "totalFunded", type: "uint256" },
      { internalType: "uint256", name: "withdrawnAmount", type: "uint256" },
      { internalType: "uint256", name: "availableFunds", type: "uint256" },
      { internalType: "bool", name: "fundingEnabled", type: "bool" },
      { internalType: "uint256", name: "backerCount", type: "uint256" },
      { internalType: "uint256", name: "percentageFunded", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "backer", type: "address" },
    ],
    name: "getContribution",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getProjectBackers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "disableFunding",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "isFundingGoalReached",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "fundingGoal", type: "uint256" },
    ],
    name: "FundingEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "backer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalFunded", type: "uint256" },
    ],
    name: "ProjectFunded",
    type: "event",
  },
] as const;
