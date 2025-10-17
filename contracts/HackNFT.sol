// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title HackNFT
 * @dev ERC-721 NFT contract for hackathon projects with free minting
 * Compatible with ERC-6551 for future Token-Bound Account upgrades
 */
contract HackNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from project hash to token ID to prevent duplicate minting
    mapping(bytes32 => uint256) public projectToTokenId;
    
    // Mapping to store project metadata on-chain
    mapping(uint256 => ProjectMetadata) public projectMetadata;

    struct ProjectMetadata {
        string projectName;
        string teamName;
        string githubUrl;
        address creator;
        uint256 mintedAt;
    }

    event ProjectMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string projectName,
        string teamName,
        bytes32 projectHash
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
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();

        // Mint NFT to sender
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Store project metadata
        projectMetadata[newTokenId] = ProjectMetadata({
            projectName: projectName,
            teamName: teamName,
            githubUrl: githubUrl,
            creator: msg.sender,
            mintedAt: block.timestamp
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
     * @dev Get total number of minted projects
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
