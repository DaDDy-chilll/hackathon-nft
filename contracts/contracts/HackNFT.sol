// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HackNFT
 * @dev ERC-721 NFT contract for hackathon projects with crowdfunding capabilities
 * Features:
 * - Free minting for hackathon projects
 * - On-chain crowdfunding with MATIC/native tokens
 * - Funding goals and progress tracking
 * - ERC-6551 compatible for Token-Bound Accounts
 * - Transparent fund tracking and withdrawal
 */
contract HackNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    // Mapping from project hash to token ID to prevent duplicate minting
    mapping(bytes32 => uint256) public projectToTokenId;
    
    // Mapping to store project metadata on-chain
    mapping(uint256 => ProjectMetadata) public projectMetadata;
    
    // Mapping to store funding information
    mapping(uint256 => FundingInfo) public projectFunding;
    
    // Mapping to track individual contributions
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    // Mapping to track backers for each project
    mapping(uint256 => address[]) private projectBackers;

    struct ProjectMetadata {
        string projectName;
        string teamName;
        string githubUrl;
        address creator;
        uint256 mintedAt;
        bool isActive;
    }
    
    struct FundingInfo {
        uint256 fundingGoal;        // Target funding amount in wei
        uint256 totalFunded;        // Total amount funded so far
        uint256 withdrawnAmount;    // Amount already withdrawn by creator
        bool fundingEnabled;        // Whether project accepts funding
        uint256 backerCount;        // Number of unique backers
    }

    event ProjectMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string projectName,
        string teamName,
        bytes32 projectHash
    );

    event ProjectTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        string projectName
    );
    
    event FundingEnabled(
        uint256 indexed tokenId,
        uint256 fundingGoal
    );
    
    event ProjectFunded(
        uint256 indexed tokenId,
        address indexed backer,
        uint256 amount,
        uint256 totalFunded
    );
    
    event FundsWithdrawn(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount
    );
    
    event FundingGoalUpdated(
        uint256 indexed tokenId,
        uint256 oldGoal,
        uint256 newGoal
    );

    constructor() ERC721("HackNFT", "HNFT") Ownable(msg.sender) {}

    /**
     * @dev Free mint function for hackathon projects
     * @param projectName Name of the project
     * @param teamName Name of the team
     * @param githubUrl GitHub repository URL
     * @param tokenURI IPFS URI for NFT metadata
     */
    function mintProject(
        string memory projectName,
        string memory teamName,
        string memory githubUrl,
        string memory tokenURI
    ) public returns (uint256) {
        // Create unique hash for the project
        bytes32 projectHash = keccak256(
            abi.encodePacked(projectName, teamName, githubUrl)
        );

        // Check if project already minted
        require(
            projectToTokenId[projectHash] == 0,
            "Project already minted"
        );

        // Increment token ID
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        // Mint NFT to sender
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Store project metadata
        projectMetadata[newTokenId] = ProjectMetadata({
            projectName: projectName,
            teamName: teamName,
            githubUrl: githubUrl,
            creator: msg.sender,
            mintedAt: block.timestamp,
            isActive: true
        });
        
        // Initialize funding info (disabled by default)
        projectFunding[newTokenId] = FundingInfo({
            fundingGoal: 0,
            totalFunded: 0,
            withdrawnAmount: 0,
            fundingEnabled: false,
            backerCount: 0
        });

        // Map project hash to token ID
        projectToTokenId[projectHash] = newTokenId;

        emit ProjectMinted(
            newTokenId,
            msg.sender,
            projectName,
            teamName,
            projectHash
        );

        return newTokenId;
    }

    /**
     * @dev Get project metadata by token ID
     */
    function getProjectMetadata(uint256 tokenId)
        public
        view
        returns (ProjectMetadata memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return projectMetadata[tokenId];
    }

    /**
     * @dev Check if a project has been minted
     */
    function isProjectMinted(
        string memory projectName,
        string memory teamName,
        string memory githubUrl
    ) public view returns (bool) {
        bytes32 projectHash = keccak256(
            abi.encodePacked(projectName, teamName, githubUrl)
        );
        return projectToTokenId[projectHash] != 0;
    }

    /**
     * @dev Get all token IDs (for frontend to fetch all projects)
     */
    function getAllTokenIds() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](_tokenIdCounter);
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            tokenIds[i - 1] = i;
        }
        return tokenIds;
    }

    /**
     * @dev Get tokens owned by a specific address
     */
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        
        return tokens;
    }

    /**
     * @dev Get total number of minted projects
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Enable crowdfunding for a project
     * @param tokenId The NFT token ID
     * @param fundingGoal Target funding amount in wei
     */
    function enableFunding(uint256 tokenId, uint256 fundingGoal) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can enable funding");
        require(fundingGoal > 0, "Funding goal must be positive");
        
        projectFunding[tokenId].fundingGoal = fundingGoal;
        projectFunding[tokenId].fundingEnabled = true;
        
        emit FundingEnabled(tokenId, fundingGoal);
    }
    
    /**
     * @dev Update funding goal
     * @param tokenId The NFT token ID
     * @param newGoal New funding goal
     */
    function updateFundingGoal(uint256 tokenId, uint256 newGoal) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can update goal");
        require(newGoal > 0, "Goal must be positive");
        
        uint256 oldGoal = projectFunding[tokenId].fundingGoal;
        projectFunding[tokenId].fundingGoal = newGoal;
        
        emit FundingGoalUpdated(tokenId, oldGoal, newGoal);
    }
    
    /**
     * @dev Fund a project (receive MATIC/native tokens)
     * @param tokenId The NFT token ID to fund
     */
    function fundProject(uint256 tokenId) public payable nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Project does not exist");
        require(projectFunding[tokenId].fundingEnabled, "Funding not enabled");
        require(msg.value > 0, "Must send funds");
        require(msg.sender != projectMetadata[tokenId].creator, "Creator cannot fund own project");
        
        // Track if this is a new backer
        if (contributions[tokenId][msg.sender] == 0) {
            projectBackers[tokenId].push(msg.sender);
            projectFunding[tokenId].backerCount++;
        }
        
        // Update contribution tracking
        contributions[tokenId][msg.sender] += msg.value;
        projectFunding[tokenId].totalFunded += msg.value;
        
        emit ProjectFunded(
            tokenId,
            msg.sender,
            msg.value,
            projectFunding[tokenId].totalFunded
        );
    }
    
    /**
     * @dev Withdraw funds from a project (only owner)
     * @param tokenId The NFT token ID
     * @param amount Amount to withdraw in wei
     */
    function withdrawFunds(uint256 tokenId, uint256 amount) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Only owner can withdraw");
        
        uint256 availableFunds = projectFunding[tokenId].totalFunded - 
                                 projectFunding[tokenId].withdrawnAmount;
        require(amount <= availableFunds, "Insufficient funds");
        
        projectFunding[tokenId].withdrawnAmount += amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(tokenId, msg.sender, amount);
    }
    
    /**
     * @dev Get funding details for a project
     * @param tokenId The NFT token ID
     */
    function getFundingInfo(uint256 tokenId) public view returns (
        uint256 fundingGoal,
        uint256 totalFunded,
        uint256 withdrawnAmount,
        uint256 availableFunds,
        bool fundingEnabled,
        uint256 backerCount,
        uint256 percentageFunded
    ) {
        FundingInfo memory info = projectFunding[tokenId];
        availableFunds = info.totalFunded - info.withdrawnAmount;
        percentageFunded = info.fundingGoal > 0 
            ? (info.totalFunded * 100) / info.fundingGoal 
            : 0;
        
        return (
            info.fundingGoal,
            info.totalFunded,
            info.withdrawnAmount,
            availableFunds,
            info.fundingEnabled,
            info.backerCount,
            percentageFunded
        );
    }
    
    /**
     * @dev Get contribution amount for a specific backer
     * @param tokenId The NFT token ID
     * @param backer Address of the backer
     */
    function getContribution(uint256 tokenId, address backer) public view returns (uint256) {
        return contributions[tokenId][backer];
    }
    
    /**
     * @dev Get all backers for a project
     * @param tokenId The NFT token ID
     */
    function getProjectBackers(uint256 tokenId) public view returns (address[] memory) {
        return projectBackers[tokenId];
    }
    
    /**
     * @dev Disable funding for a project
     * @param tokenId The NFT token ID
     */
    function disableFunding(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can disable funding");
        projectFunding[tokenId].fundingEnabled = false;
    }
    
    /**
     * @dev Check if funding goal is reached
     * @param tokenId The NFT token ID
     */
    function isFundingGoalReached(uint256 tokenId) public view returns (bool) {
        return projectFunding[tokenId].totalFunded >= projectFunding[tokenId].fundingGoal;
    }
}
