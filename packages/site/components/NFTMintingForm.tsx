"use client";

import { useState } from "react";
import { NFTMetadata } from "@/hooks/usePrivateNFT";

interface NFTMintingFormProps {
  onMint: (metadata: NFTMetadata) => void;
  isMinting: boolean;
  canMint: boolean;
}

export const NFTMintingForm: React.FC<NFTMintingFormProps> = ({
  onMint,
  isMinting,
  canMint,
}) => {
  const [formData, setFormData] = useState<NFTMetadata>({
    name: "",
    description: "",
    imageUrl: "",
    rarity: 50,
    power: 100,
    isLegendary: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canMint && formData.name.trim()) {
      onMint(formData);
    }
  };

  const handleInputChange = (
    field: keyof NFTMetadata,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buttonClass =
    "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg " +
    "transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent " +
    "transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500";

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  const presetImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", // Dragon
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80", // Sword
    "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&q=80", // Crystal
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80", // Shield
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80", // Magic
  ];

  const presetNFTs = [
    {
      name: "Mystic Dragon",
      description: "A legendary dragon with ancient wisdom and powerful magic",
      imageUrl: presetImages[0],
      rarity: 95,
      power: 850,
      isLegendary: true,
    },
    {
      name: "Enchanted Sword",
      description: "A blade forged in starfire with cutting through dimensions",
      imageUrl: presetImages[1],
      rarity: 80,
      power: 650,
      isLegendary: false,
    },
    {
      name: "Crystal of Power",
      description: "A mysterious crystal that amplifies magical abilities",
      imageUrl: presetImages[2],
      rarity: 70,
      power: 400,
      isLegendary: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎨 Mint Your Private NFT</h2>
        <p className="text-gray-600">
          Create an NFT with both public metadata and private encrypted attributes
        </p>
      </div>

      {/* Preset NFTs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🎲 Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presetNFTs.map((preset, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:shadow-md transition-all duration-200"
              onClick={() => setFormData(preset)}
            >
              <img
                src={preset.imageUrl}
                alt={preset.name}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <h4 className="font-medium text-sm text-gray-800">{preset.name}</h4>
              <p className="text-xs text-gray-500 truncate">{preset.description}</p>
              <div className="flex justify-between text-xs text-purple-600 mt-1">
                <span>Rarity: {preset.rarity}</span>
                <span>Power: {preset.power}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Public Metadata */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            🌐 Public Metadata (Visible to Everyone)
          </h3>
          
          <div>
            <label className={labelClass}>NFT Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter a unique name for your NFT"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your NFT's story and characteristics"
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="NFT Preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Private Attributes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              🔒 Private Attributes (Encrypted on Blockchain)
            </h3>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </button>
          </div>

          {showAdvanced && (
            <>
              <div>
                <label className={labelClass}>
                  Rarity Score (1-100) - Current: {formData.rarity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.rarity}
                  onChange={(e) => handleInputChange("rarity", Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Common (1)</span>
                  <span>Rare (50)</span>
                  <span>Legendary (100)</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Power Level (1-1000) - Current: {formData.power}
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={formData.power}
                  onChange={(e) => handleInputChange("power", Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Weak (1)</span>
                  <span>Strong (500)</span>
                  <span>Godlike (1000)</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="legendary"
                  checked={formData.isLegendary}
                  onChange={(e) => handleInputChange("isLegendary", e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="legendary" className="text-sm font-medium text-gray-700">
                  ⭐ Mark as Legendary Item (Ultra Rare)
                </label>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-gray-700 mb-2">📋 NFT Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {formData.name || "Unnamed NFT"}</p>
            <p><strong>Rarity:</strong> {formData.rarity}/100</p>
            <p><strong>Power:</strong> {formData.power}/1000</p>
            <p><strong>Status:</strong> {formData.isLegendary ? "🌟 Legendary" : "⚪ Regular"}</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canMint || !formData.name.trim()}
          className={buttonClass}
        >
          {isMinting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting NFT...
            </>
          ) : (
            <>
              <span className="mr-2">🎨</span>
              Mint Private NFT
            </>
          )}
        </button>

        {!canMint && (
          <p className="text-sm text-red-600 text-center">
            Please connect your wallet and ensure the contract is deployed to mint NFTs
          </p>
        )}
      </form>
    </div>
  );
};
