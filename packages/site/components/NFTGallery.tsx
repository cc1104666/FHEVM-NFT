"use client";

import { NFTPublicData, DecryptedPrivateData } from "@/hooks/usePrivateNFT";

interface NFTCardProps {
  tokenId: number;
  publicData: NFTPublicData;
  decryptedData?: DecryptedPrivateData;
  onDecrypt: (tokenId: number) => void;
  canDecrypt: boolean;
  isDecrypting: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  publicData,
  decryptedData,
  onDecrypt,
  canDecrypt,
  isDecrypting,
}) => {
  const isDecrypted = !!decryptedData;

  const getRarityColor = (rarity: number) => {
    if (rarity >= 90) return "text-yellow-600 bg-yellow-100";
    if (rarity >= 70) return "text-purple-600 bg-purple-100";
    if (rarity >= 50) return "text-blue-600 bg-blue-100";
    return "text-gray-600 bg-gray-100";
  };

  const getRarityLabel = (rarity: number) => {
    if (rarity >= 90) return "Legendary";
    if (rarity >= 70) return "Epic";
    if (rarity >= 50) return "Rare";
    return "Common";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
        {publicData.imageUrl ? (
          <img
            src={publicData.imageUrl}
            alt={publicData.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🎨</span>
          </div>
        )}
        
        {/* Token ID Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-medium">
          #{tokenId}
        </div>

        {/* Legendary Badge */}
        {isDecrypted && decryptedData.isLegendary && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
            ⭐ LEGENDARY
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name and Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {publicData.name}
          </h3>
          {publicData.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {publicData.description}
            </p>
          )}
        </div>

        {/* Public Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Owner: {publicData.owner.slice(0, 6)}...{publicData.owner.slice(-4)}</span>
          <span>Exists: {publicData.exists ? "✅" : "❌"}</span>
        </div>

        {/* Private Attributes */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">🔒 Private Attributes</h4>
            {!isDecrypted && (
              <button
                onClick={() => onDecrypt(tokenId)}
                disabled={!canDecrypt || isDecrypting}
                className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isDecrypting ? "Decrypting..." : "Decrypt"}
              </button>
            )}
          </div>

          {isDecrypted ? (
            <div className="space-y-2">
              {/* Rarity */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Rarity:</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getRarityColor(
                    Number(decryptedData.rarity)
                  )}`}
                >
                  {decryptedData.rarity}/100 ({getRarityLabel(Number(decryptedData.rarity))})
                </span>
              </div>

              {/* Power */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Power:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((Number(decryptedData.power) / 1000) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {decryptedData.power}/1000
                  </span>
                </div>
              </div>

              {/* Legendary Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Status:</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    decryptedData.isLegendary
                      ? "text-yellow-700 bg-yellow-200"
                      : "text-gray-600 bg-gray-200"
                  }`}
                >
                  {decryptedData.isLegendary ? "🌟 Legendary" : "⚪ Regular"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 text-xs">
                🔐 Private attributes are encrypted
              </div>
              <div className="text-gray-300 text-xs mt-1">
                Click &quot;Decrypt&quot; to reveal hidden stats
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NFTGalleryProps {
  ownedTokens: number[];
  tokenPublicData: Record<number, NFTPublicData>;
  decryptedPrivateData: Record<number, DecryptedPrivateData>;
  onDecrypt: (tokenId: number) => void;
  canDecrypt: boolean;
  isDecrypting: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({
  ownedTokens,
  tokenPublicData,
  decryptedPrivateData,
  onDecrypt,
  canDecrypt,
  isDecrypting,
  isLoading,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center space-x-2">
          <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading your NFTs...</span>
        </div>
      </div>
    );
  }

  if (ownedTokens.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">🎨</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No NFTs Found</h3>
        <p className="text-gray-500 mb-4">
          You don&apos;t own any NFTs yet. Start by minting your first private NFT!
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🖼️ Your NFT Collection</h2>
          <p className="text-gray-600">
            You own {ownedTokens.length} NFT{ownedTokens.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
        >
          <svg
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownedTokens.map((tokenId) => (
          <NFTCard
            key={tokenId}
            tokenId={tokenId}
            publicData={tokenPublicData[tokenId]}
            decryptedData={decryptedPrivateData[tokenId]}
            onDecrypt={onDecrypt}
            canDecrypt={canDecrypt}
            isDecrypting={isDecrypting}
          />
        ))}
      </div>
    </div>
  );
};
