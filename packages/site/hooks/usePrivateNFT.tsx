"use client";

import { ethers } from "ethers";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

// Import generated ABI and addresses
import { PrivateNFTAddresses } from "@/abi/PrivateNFTAddresses";
import { PrivateNFTABI } from "@/abi/PrivateNFTABI";

export type NFTMetadata = {
  name: string;
  description: string;
  imageUrl: string;
  rarity: number;
  power: number;
  isLegendary: boolean;
};

export type NFTPublicData = {
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  exists: boolean;
};

export type DecryptedPrivateData = {
  tokenId: string;
  rarity: string | bigint;
  power: string | bigint;
  isLegendary: boolean;
};

type PrivateNFTInfoType = {
  abi: typeof PrivateNFTABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

/**
 * Resolves PrivateNFT contract metadata for the given EVM `chainId`.
 */
function getPrivateNFTByChainId(
  chainId: number | undefined
): PrivateNFTInfoType {
  if (!chainId) {
    return { abi: PrivateNFTABI.abi };
  }

  const entry =
    PrivateNFTAddresses[chainId.toString() as keyof typeof PrivateNFTAddresses];

  if (!entry || !("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: PrivateNFTABI.abi, chainId };
  }

  return {
    address: entry?.address as `0x${string}` | undefined,
    chainId: entry?.chainId ?? chainId,
    chainName: entry?.chainName,
    abi: PrivateNFTABI.abi,
  };
}

/**
 * Hook for interacting with the PrivateNFT contract
 */
export const usePrivateNFT = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) => {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  // State variables
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [tokenPublicData, setTokenPublicData] = useState<Record<number, NFTPublicData>>({});
  const [decryptedPrivateData, setDecryptedPrivateData] = useState<Record<number, DecryptedPrivateData>>({});
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

  // Refs for latest values
  const contractRef = useRef<PrivateNFTInfoType | undefined>(undefined);
  const isLoadingRef = useRef<boolean>(false);
  const isMintingRef = useRef<boolean>(false);
  const isDecryptingRef = useRef<boolean>(false);

  // Contract info
  const privateNFT = useMemo(() => {
    const c = getPrivateNFTByChainId(chainId);
    contractRef.current = c;

    if (!c.address) {
      setMessage(`PrivateNFT deployment not found for chainId=${chainId}.`);
    }

    return c;
  }, [chainId]);

  // Contract deployment status
  const isDeployed = useMemo(() => {
    if (!privateNFT) {
      return undefined;
    }
    return Boolean(privateNFT.address) && privateNFT.address !== ethers.ZeroAddress;
  }, [privateNFT]);

  // Check if operations are available
  const canMint = useMemo(() => {
    return privateNFT.address && instance && ethersSigner && !isMinting;
  }, [privateNFT.address, instance, ethersSigner, isMinting]);

  const canLoadNFTs = useMemo(() => {
    return privateNFT.address && ethersReadonlyProvider && ethersSigner;
  }, [privateNFT.address, ethersReadonlyProvider, ethersSigner]);

  const canDecrypt = useMemo(() => {
    return privateNFT.address && instance && ethersSigner && !isDecrypting;
  }, [privateNFT.address, instance, ethersSigner, isDecrypting]);

  /**
   * Load owned NFTs from the contract
   */
  const loadOwnedNFTs = useCallback(async () => {
    if (isLoadingRef.current || !contractRef.current?.address || !ethersReadonlyProvider || !ethersSigner) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const contract = new ethers.Contract(
        contractRef.current.address,
        contractRef.current.abi,
        ethersReadonlyProvider
      );

      // Get owned token IDs
      const tokenIds = await contract.getTokensByOwner(ethersSigner.address);
      const tokenIdsArray = tokenIds.map((id: any) => Number(id));

      // Get public data for each token
      const publicDataPromises = tokenIdsArray.map(async (tokenId: number) => {
        const publicData = await contract.getPublicData(tokenId);
        return {
          tokenId,
          data: {
            name: publicData.name,
            description: publicData.description,
            imageUrl: publicData.imageUrl,
            owner: publicData.owner,
            exists: publicData.exists,
          }
        };
      });

      const publicDataResults = await Promise.all(publicDataPromises);
      const newPublicData: Record<number, NFTPublicData> = {};
      
      publicDataResults.forEach(({ tokenId, data }) => {
        newPublicData[tokenId] = data;
      });

      // Get total supply
      const supply = await contract.totalSupply();

      setOwnedTokens(tokenIdsArray);
      setTokenPublicData(newPublicData);
      setTotalSupply(Number(supply));
      setHasLoadedOnce(true);
      setMessage(`Loaded ${tokenIdsArray.length} NFTs`);

    } catch (error) {
      console.error("Error loading NFTs:", error);
      setMessage(`Error loading NFTs: ${error}`);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [ethersReadonlyProvider, ethersSigner]);

  /**
   * Mint a new NFT
   */
  const mintNFT = useCallback(async (metadata: NFTMetadata) => {
    if (isMintingRef.current || !contractRef.current?.address || !instance || !ethersSigner) {
      return;
    }

    isMintingRef.current = true;
    setIsMinting(true);
    setMessage("Starting NFT mint...");

    try {
      const contract = new ethers.Contract(
        contractRef.current.address,
        contractRef.current.abi,
        ethersSigner
      );

      // Create encrypted inputs for private attributes
      const input = instance.createEncryptedInput(
        contractRef.current.address,
        ethersSigner.address
      );

      // Add encrypted values
      input.add32(metadata.rarity); // rarity (1-100)
      input.add32(metadata.power);  // power level
      input.addBool(metadata.isLegendary); // legendary status

      setMessage("Encrypting private attributes...");
      const encryptedInput = await input.encrypt();

      setMessage("Sending mint transaction...");
      
      // Call mint function with the simplified signature
      const tx = await contract.mint(
        ethersSigner.address,
        metadata.name,
        metadata.description,
        metadata.imageUrl,
        encryptedInput.handles[0], // rarity
        encryptedInput.handles[1], // power
        encryptedInput.handles[2], // isLegendary
        encryptedInput.inputProof  // single proof for all encrypted values
      );

      setMessage(`Waiting for transaction: ${tx.hash}`);
      const receipt = await tx.wait();

      setMessage(`NFT minted successfully! Gas used: ${receipt?.gasUsed}`);
      
      // Reset flag and reload NFTs
      setHasLoadedOnce(false);
      await loadOwnedNFTs();

    } catch (error) {
      console.error("Error minting NFT:", error);
      setMessage(`Error minting NFT: ${error}`);
    } finally {
      isMintingRef.current = false;
      setIsMinting(false);
    }
  }, [instance, ethersSigner, loadOwnedNFTs]);

  /**
   * Decrypt private attributes of an NFT
   */
  const decryptPrivateData = useCallback(async (tokenId: number) => {
    if (isDecryptingRef.current || !contractRef.current?.address || !instance || !ethersSigner) {
      return;
    }

    // Check if already decrypted
    if (decryptedPrivateData[tokenId]) {
      return;
    }

    isDecryptingRef.current = true;
    setIsDecrypting(true);
    setMessage(`Starting decryption for NFT #${tokenId}...`);

    try {
      const contract = new ethers.Contract(
        contractRef.current.address,
        contractRef.current.abi,
        ethersReadonlyProvider || ethersSigner
      );

      // Get encrypted handles
      const rarityHandle = await contract.getRarity(tokenId);
      const powerHandle = await contract.getPower(tokenId);
      const isLegendaryHandle = await contract.getIsLegendary(tokenId);

      // Create decryption signature
      const sig = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [contractRef.current.address as `0x${string}`],
        ethersSigner,
        fhevmDecryptionSignatureStorage
      );

      if (!sig) {
        setMessage("Unable to create decryption signature");
        return;
      }

      setMessage("Decrypting private attributes...");

      // Decrypt the values
      const decryptedResults = await instance.userDecrypt(
        [
          { handle: rarityHandle, contractAddress: contractRef.current.address },
          { handle: powerHandle, contractAddress: contractRef.current.address },
          { handle: isLegendaryHandle, contractAddress: contractRef.current.address },
        ],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const decryptedData: DecryptedPrivateData = {
        tokenId: tokenId.toString(),
        rarity: decryptedResults[rarityHandle] as string | bigint,
        power: decryptedResults[powerHandle] as string | bigint,
        isLegendary: decryptedResults[isLegendaryHandle] === true,
      };

      setDecryptedPrivateData(prev => ({
        ...prev,
        [tokenId]: decryptedData
      }));

      setMessage(`NFT #${tokenId} private data decrypted successfully!`);

    } catch (error) {
      console.error("Error decrypting NFT:", error);
      setMessage(`Error decrypting NFT #${tokenId}: ${error}`);
    } finally {
      isDecryptingRef.current = false;
      setIsDecrypting(false);
    }
  }, [instance, ethersSigner, ethersReadonlyProvider, fhevmDecryptionSignatureStorage, decryptedPrivateData]);

  // Auto-load NFTs when contract is available (only once)
  useEffect(() => {
    if (canLoadNFTs && !hasLoadedOnce && !isLoadingRef.current) {
      loadOwnedNFTs();
    }
  }, [canLoadNFTs, hasLoadedOnce]); // Load only once when conditions are met

  return {
    // Contract info
    contractAddress: privateNFT.address,
    isDeployed,
    
    // Data
    ownedTokens,
    tokenPublicData,
    decryptedPrivateData,
    totalSupply,
    
    // States
    isLoading,
    isMinting,
    isDecrypting,
    message,
    
    // Capabilities
    canMint,
    canLoadNFTs,
    canDecrypt,
    
    // Actions
    mintNFT,
    loadOwnedNFTs,
    decryptPrivateData,
  };
};
