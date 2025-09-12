// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title A Privacy-Preserving NFT contract using FHEVM
/// @author fhevm-nft-template
/// @notice An NFT contract with encrypted private attributes that only the owner can decrypt
contract PrivateNFT is SepoliaConfig {
    // Public NFT data
    struct PublicNFTData {
        string name;
        string description;
        string imageUrl;
        address owner;
        bool exists;
    }

    // Private NFT attributes (encrypted)
    struct PrivateNFTData {
        euint32 rarity;        // 1-100 rarity score (encrypted)
        euint32 power;         // Special power level (encrypted)
        ebool isLegendary;     // Whether it's a legendary item (encrypted)
    }

    // State variables
    uint256 private _tokenIdCounter;
    uint256 public totalSupply;
    mapping(uint256 => PublicNFTData) public publicData;
    mapping(uint256 => PrivateNFTData) private privateData;
    mapping(address => uint256[]) public ownerTokens;
    mapping(uint256 => uint256) private ownerTokenIndex; // tokenId => index in ownerTokens array

    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string name);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    /// @notice Mint a new NFT with both public and private attributes
    /// @param to The address to mint the NFT to
    /// @param name The public name of the NFT
    /// @param description The public description of the NFT
    /// @param imageUrl The public image URL of the NFT
    /// @param encryptedRarity The encrypted rarity score (1-100)
    /// @param encryptedPower The encrypted power level
    /// @param encryptedIsLegendary The encrypted legendary status
    /// @param inputProof The input proof for all encrypted values
    function mint(
        address to,
        string memory name,
        string memory description,
        string memory imageUrl,
        externalEuint32 encryptedRarity,
        externalEuint32 encryptedPower,
        externalEbool encryptedIsLegendary,
        bytes calldata inputProof
    ) external returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(name).length > 0, "Name cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        totalSupply++;

        // Set public data
        _setPublicData(tokenId, name, description, imageUrl, to);

        // Set private data (encrypted) - all use the same proof
        _setPrivateDataSimple(tokenId, encryptedRarity, encryptedPower, encryptedIsLegendary, inputProof, to);

        // Add to owner's token list
        ownerTokens[to].push(tokenId);
        ownerTokenIndex[tokenId] = ownerTokens[to].length - 1;

        emit NFTMinted(tokenId, to, name);
        return tokenId;
    }

    /// @notice Internal function to set public data
    function _setPublicData(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory imageUrl,
        address to
    ) internal {
        publicData[tokenId] = PublicNFTData({
            name: name,
            description: description,
            imageUrl: imageUrl,
            owner: to,
            exists: true
        });
    }

    /// @notice Internal function to set private data with simplified proof
    function _setPrivateDataSimple(
        uint256 tokenId,
        externalEuint32 encryptedRarity,
        externalEuint32 encryptedPower,
        externalEbool encryptedIsLegendary,
        bytes calldata inputProof,
        address to
    ) internal {
        euint32 rarity = FHE.fromExternal(encryptedRarity, inputProof);
        euint32 power = FHE.fromExternal(encryptedPower, inputProof);
        ebool isLegendary = FHE.fromExternal(encryptedIsLegendary, inputProof);

        privateData[tokenId] = PrivateNFTData({
            rarity: rarity,
            power: power,
            isLegendary: isLegendary
        });

        // Allow the owner and contract to access private data
        FHE.allowThis(rarity);
        FHE.allow(rarity, to);
        FHE.allowThis(power);
        FHE.allow(power, to);
        FHE.allowThis(isLegendary);
        FHE.allow(isLegendary, to);
    }

    /// @notice Internal function to set private data (legacy version with separate proofs)
    function _setPrivateData(
        uint256 tokenId,
        externalEuint32 encryptedRarity,
        bytes calldata rarityProof,
        externalEuint32 encryptedPower,
        bytes calldata powerProof,
        externalEbool encryptedIsLegendary,
        bytes calldata legendaryProof,
        address to
    ) internal {
        euint32 rarity = FHE.fromExternal(encryptedRarity, rarityProof);
        euint32 power = FHE.fromExternal(encryptedPower, powerProof);
        ebool isLegendary = FHE.fromExternal(encryptedIsLegendary, legendaryProof);

        privateData[tokenId] = PrivateNFTData({
            rarity: rarity,
            power: power,
            isLegendary: isLegendary
        });

        // Allow the owner and contract to access private data
        FHE.allowThis(rarity);
        FHE.allow(rarity, to);
        FHE.allowThis(power);
        FHE.allow(power, to);
        FHE.allowThis(isLegendary);
        FHE.allow(isLegendary, to);
    }

    /// @notice Transfer an NFT to another address
    /// @param tokenId The token ID to transfer
    /// @param to The address to transfer to
    function transfer(uint256 tokenId, address to) external {
        require(to != address(0), "Cannot transfer to zero address");
        require(publicData[tokenId].exists, "Token does not exist");
        require(publicData[tokenId].owner == msg.sender, "Not the owner");
        require(to != msg.sender, "Cannot transfer to yourself");

        address from = msg.sender;
        
        // Update public data
        publicData[tokenId].owner = to;

        // Update private data permissions
        PrivateNFTData storage privateToken = privateData[tokenId];
        
        // Revoke permissions from old owner
        FHE.allowThis(privateToken.rarity);
        FHE.allowThis(privateToken.power);
        FHE.allowThis(privateToken.isLegendary);
        
        // Grant permissions to new owner
        FHE.allow(privateToken.rarity, to);
        FHE.allow(privateToken.power, to);
        FHE.allow(privateToken.isLegendary, to);

        // Remove from old owner's token list
        _removeTokenFromOwner(from, tokenId);
        
        // Add to new owner's token list
        ownerTokens[to].push(tokenId);
        ownerTokenIndex[tokenId] = ownerTokens[to].length - 1;

        emit NFTTransferred(tokenId, from, to);
    }

    /// @notice Get the encrypted rarity of an NFT (only accessible by owner)
    /// @param tokenId The token ID
    /// @return The encrypted rarity score
    function getRarity(uint256 tokenId) external view returns (euint32) {
        require(publicData[tokenId].exists, "Token does not exist");
        return privateData[tokenId].rarity;
    }

    /// @notice Get the encrypted power of an NFT (only accessible by owner)
    /// @param tokenId The token ID
    /// @return The encrypted power level
    function getPower(uint256 tokenId) external view returns (euint32) {
        require(publicData[tokenId].exists, "Token does not exist");
        return privateData[tokenId].power;
    }

    /// @notice Get the encrypted legendary status of an NFT (only accessible by owner)
    /// @param tokenId The token ID
    /// @return The encrypted legendary status
    function getIsLegendary(uint256 tokenId) external view returns (ebool) {
        require(publicData[tokenId].exists, "Token does not exist");
        return privateData[tokenId].isLegendary;
    }

    /// @notice Get all public data for an NFT
    /// @param tokenId The token ID
    /// @return The public NFT data
    function getPublicData(uint256 tokenId) external view returns (PublicNFTData memory) {
        require(publicData[tokenId].exists, "Token does not exist");
        return publicData[tokenId];
    }

    /// @notice Get the number of NFTs owned by an address
    /// @param owner The owner address
    /// @return The number of tokens owned
    function balanceOf(address owner) external view returns (uint256) {
        return ownerTokens[owner].length;
    }

    /// @notice Get all token IDs owned by an address
    /// @param owner The owner address
    /// @return An array of token IDs
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return ownerTokens[owner];
    }

    /// @notice Check if a token exists
    /// @param tokenId The token ID
    /// @return Whether the token exists
    function exists(uint256 tokenId) external view returns (bool) {
        return publicData[tokenId].exists;
    }

    /// @notice Get the owner of a token
    /// @param tokenId The token ID
    /// @return The owner address
    function ownerOf(uint256 tokenId) external view returns (address) {
        require(publicData[tokenId].exists, "Token does not exist");
        return publicData[tokenId].owner;
    }

    /// @notice Internal function to remove a token from an owner's list
    /// @param owner The owner address
    /// @param tokenId The token ID to remove
    function _removeTokenFromOwner(address owner, uint256 tokenId) private {
        uint256[] storage tokens = ownerTokens[owner];
        uint256 index = ownerTokenIndex[tokenId];
        uint256 lastIndex = tokens.length - 1;

        if (index != lastIndex) {
            uint256 lastTokenId = tokens[lastIndex];
            tokens[index] = lastTokenId;
            ownerTokenIndex[lastTokenId] = index;
        }

        tokens.pop();
        delete ownerTokenIndex[tokenId];
    }
}
