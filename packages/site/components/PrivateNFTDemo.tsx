"use client";

import { useState } from "react";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { usePrivateNFT } from "@/hooks/usePrivateNFT";
import { NFTMintingForm } from "./NFTMintingForm";
import { NFTGallery } from "./NFTGallery";
import { NetworkWarning } from "./NetworkWarning";
import { AutoNetworkSwitch } from "./AutoNetworkSwitch";
import { errorNotDeployed } from "./ErrorNotDeployed";

export const PrivateNFTDemo = () => {
  const [activeTab, setActiveTab] = useState<"mint" | "gallery">("mint");
  
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  // FHEVM instance
  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  // Private NFT hook
  const privateNFT = usePrivateNFT({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-sm " +
    "transition-colors duration-200 hover:bg-gray-700 active:bg-gray-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const tabButtonClass = (isActive: boolean) =>
    `px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-purple-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  const titleClass = "font-semibold text-black text-lg mt-4";

  // Helper function to print properties
  function printProperty(name: string, value: unknown) {
    let displayValue: string;

    if (typeof value === "boolean") {
      return printBooleanProperty(name, value);
    } else if (typeof value === "string" || typeof value === "number") {
      displayValue = String(value);
    } else if (typeof value === "bigint") {
      displayValue = String(value);
    } else if (value === null) {
      displayValue = "null";
    } else if (value === undefined) {
      displayValue = "undefined";
    } else if (value instanceof Error) {
      displayValue = value.message;
    } else {
      displayValue = JSON.stringify(value);
    }
    return (
      <p className="text-black">
        {name}:{" "}
        <span className="font-mono font-semibold text-black">{displayValue}</span>
      </p>
    );
  }

  function printBooleanProperty(name: string, value: boolean) {
    if (value) {
      return (
        <p className="text-black">
          {name}:{" "}
          <span className="font-mono font-semibold text-green-500">true</span>
        </p>
      );
    }

    return (
      <p className="text-black">
        {name}:{" "}
        <span className="font-mono font-semibold text-red-500">false</span>
      </p>
    );
  }

  // Connection check
  if (!isConnected) {
    return (
      <div className="mx-auto">
        <button
          className={buttonClass}
          disabled={isConnected}
          onClick={connect}
        >
          <span className="text-4xl p-6">Connect to MetaMask</span>
        </button>
      </div>
    );
  }


  // Deployment check
  if (privateNFT.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="grid w-full gap-6">
      {/* Auto Network Switch */}
      <AutoNetworkSwitch
        currentChainId={chainId}
        expectedChainId={11155111}
        provider={provider}
      />
      
      {/* Network Warning */}
      <NetworkWarning 
        currentChainId={chainId} 
        expectedChainId={11155111}
      />

      {/* Header */}
      <div className="col-span-full mx-4 lg:mx-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2">
            🎨 Private NFT Marketplace
          </h1>
          <p className="text-purple-100 text-lg">
            Mint NFTs with encrypted private attributes using FHEVM technology
          </p>
        </div>
      </div>

      {/* Debug Information */}
      <div className="col-span-full mx-4 lg:mx-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chain Info */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className={titleClass}>⛓️ Chain Info</p>
          {printProperty("Chain ID", chainId)}
          {printProperty(
            "MetaMask Accounts",
            accounts
              ? accounts.length === 0
                ? "No accounts"
                : `${accounts.length} account(s)`
              : "undefined"
          )}
          {printProperty(
            "Signer",
            ethersSigner ? `${ethersSigner.address.slice(0, 6)}...${ethersSigner.address.slice(-4)}` : "No signer"
          )}
        </div>

        {/* Contract Info */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className={titleClass}>📋 Contract Info</p>
          {printProperty("PrivateNFT", privateNFT.contractAddress || "Not deployed")}
          {printProperty("Is Deployed", privateNFT.isDeployed)}
          {printProperty("Total Supply", privateNFT.totalSupply)}
          {printProperty("Owned NFTs", privateNFT.ownedTokens.length)}
        </div>

        {/* FHEVM Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <p className={titleClass}>🔐 FHEVM Status</p>
          {printProperty("Instance", fhevmInstance ? "Ready" : "Not ready")}
          {printProperty("Status", fhevmStatus)}
          {printProperty("Error", fhevmError?.message || "None")}
        </div>
      </div>


      {/* Tab Navigation */}
      <div className="col-span-full mx-4 lg:mx-20">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("mint")}
            className={tabButtonClass(activeTab === "mint")}
          >
            🎨 Mint NFT
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={tabButtonClass(activeTab === "gallery")}
          >
            🖼️ My Collection ({privateNFT.ownedTokens.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "mint" && (
            <NFTMintingForm
              onMint={privateNFT.mintNFT}
              isMinting={privateNFT.isMinting}
              canMint={privateNFT.canMint}
            />
          )}

          {activeTab === "gallery" && (
            <NFTGallery
              ownedTokens={privateNFT.ownedTokens}
              tokenPublicData={privateNFT.tokenPublicData}
              decryptedPrivateData={privateNFT.decryptedPrivateData}
              onDecrypt={privateNFT.decryptPrivateData}
              canDecrypt={privateNFT.canDecrypt}
              isDecrypting={privateNFT.isDecrypting}
              isLoading={privateNFT.isLoading}
              onRefresh={privateNFT.loadOwnedNFTs}
            />
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="col-span-full mx-4 lg:mx-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
        <p className={titleClass}>📢 Status Messages</p>
        <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 min-h-[60px] flex items-center">
          <code className="text-sm text-gray-700 break-all">
            {privateNFT.message || "Ready to mint your first private NFT! 🚀"}
          </code>
        </div>
      </div>
    </div>
  );
};
