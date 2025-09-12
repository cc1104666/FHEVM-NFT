# 🎨 Private NFT Marketplace - FHEVM Demo

*[中文版本 / Chinese Version](./README_ZH.md)*

A privacy-preserving NFT minting and management application built with FHEVM (Fully Homomorphic Encryption Virtual Machine) technology.

## ✨ Key Features

### 🔐 Privacy Protection
- **Public Metadata**: Name, description, image URL and other publicly visible information
- **Encrypted Private Attributes**: Rarity, power value, legendary status and other sensitive data encrypted with FHEVM
- **On-Demand Decryption**: Only NFT owners can decrypt and view private attributes

### 🎯 Core Functionality
1. **NFT Minting**: Create NFTs with both public and private attributes
2. **Collection Display**: View your owned NFT collection
3. **Attribute Decryption**: Decrypt and view private NFT attributes
4. **Real-time Status**: Display contract status, transaction progress and other information

## 🏗️ Technical Architecture

### Smart Contract Layer
- **PrivateNFT.sol**: NFT contract with FHEVM encrypted attributes support
- **Encryption Types**: Uses `euint32` and `ebool` to store private data
- **Access Control**: Controls data access through FHEVM's permission system

### Frontend Tech Stack
- **React 19 + Next.js 15**: Modern frontend framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Responsive UI design
- **ethers.js**: Ethereum interaction library

### FHEVM Integration
- **@zama-fhe/relayer-sdk**: FHEVM client SDK
- **Input Encryption**: Frontend encrypts user input
- **Decryption Signatures**: Manages decryption permissions and signatures

## 📁 Project Structure

```
packages/site/
├── components/
│   ├── PrivateNFTDemo.tsx      # Main demo component
│   ├── NFTMintingForm.tsx      # NFT minting form
│   ├── NFTGallery.tsx          # NFT display gallery
│   └── ErrorNotDeployed.tsx    # Error handling component
├── hooks/
│   ├── usePrivateNFT.tsx       # NFT contract interaction hook
│   ├── useFHECounter.tsx       # Original counter hook
│   └── metamask/               # MetaMask wallet integration
├── fhevm/                      # FHEVM core modules
├── abi/                        # Auto-generated contract ABIs
└── scripts/
    └── genabi-nft.mjs          # NFT ABI generation script

packages/fhevm-hardhat-template/
├── contracts/
│   ├── PrivateNFT.sol          # Private NFT smart contract
│   └── FHECounter.sol          # Original counter contract
├── deploy/
│   └── deployPrivateNFT.ts     # NFT contract deployment script
└── deployments/localhost/      # Local deployment information
```

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Start Hardhat node (new terminal)
cd packages/fhevm-hardhat-template
npx hardhat node --verbose

# Deploy contracts (new terminal)
npx hardhat deploy --network localhost

# Generate ABI
cd ../site
npm run genabi-nft
```

### 2. Launch Application
```bash
# Development mode (with FHEVM simulation support)
npm run dev:mock

# Open browser and visit
# http://localhost:3000
```

### 3. MetaMask Configuration
- **Network Name**: Hardhat
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

## 🎮 User Guide

### Minting NFTs
1. Connect MetaMask wallet
2. Fill in public metadata (name, description, image URL)
3. Set private attributes (rarity, power value, legendary status)
4. Click "Mint Private NFT" button
5. Confirm MetaMask transaction

### Viewing Collection
1. Switch to "My Collection" tab
2. View your owned NFT list
3. Click "Decrypt" button to decrypt private attributes
4. View complete NFT information

## 🔍 Featured Demonstrations

### Encrypted Attribute Types
- **Rarity**: Encrypted value from 1-100, representing NFT rarity level
- **Power**: Encrypted value from 1-1000, representing NFT power level
- **Legendary Status**: Encrypted boolean value, marking whether it's a legendary item

### Preset Templates
The application provides three preset NFT templates:
1. **Mystic Dragon**: High rarity legendary creature
2. **Enchanted Sword**: Medium rarity weapon
3. **Power Crystal**: Low rarity magical artifact

### User Interface Features
- **Gradient Design**: Modern purple-blue gradient theme
- **Responsive Layout**: Supports various screen sizes
- **Real-time Feedback**: Transaction status and error messages displayed in real-time
- **Debug Information**: Shows chain info, contract status, FHEVM status

## 🛠️ Development Guide

### Adding New Encrypted Attributes
1. Define new encryption types in the contract
2. Update `PrivateNFTData` struct
3. Modify mint function to accept new parameters
4. Add corresponding UI controls in the frontend

### Customizing UI Components
- All components are designed with Tailwind CSS
- Supports dark/light theme switching
- Easy to customize colors and styles

### Extending Contract Functionality
- Add NFT transfer functionality
- Implement marketplace trading features
- Support batch operations

## 🔐 Security Considerations

### FHEVM Security Features
- Private data remains encrypted on the blockchain at all times
- Only authorized users can decrypt specific data
- Uses Zama's FHE technology to ensure computational security

### Permission Management
- Private data of each NFT is only visible to its owner
- Contract deployer cannot access user private data
- Automatically updates access permissions when transferring NFTs

## 🌟 Future Improvements

### Planned Features
- [ ] IPFS integration for metadata storage
- [ ] NFT marketplace trading functionality
- [ ] Batch minting and management
- [ ] Social sharing features
- [ ] Mobile adaptation

### Technical Optimizations
- [ ] Gas fee optimization
- [ ] Better error handling
- [ ] Offline mode support
- [ ] Multi-chain support

## 📚 Learning Resources

- [FHEVM Official Documentation](https://docs.zama.ai/protocol/)
- [Zama FHE Technology Introduction](https://zama.ai/)
- [Ethereum Development Guide](https://ethereum.org/developers/)
- [React Official Documentation](https://react.dev/)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

BSD-3-Clause-Clear License

---

**This project demonstrates how to build privacy-preserving Web3 applications using FHEVM technology, providing users with true data privacy protection.**

*[中文版本 / Chinese Version](./NFT_APP_README.md)*

