const fs = require('fs');
const path = require('path');

// Read the compiled contract artifacts
const privateNFTArtifact = JSON.parse(fs.readFileSync('./artifacts/contracts/PrivateNFT.sol/PrivateNFT.json', 'utf8'));
const fheCounterArtifact = JSON.parse(fs.readFileSync('./artifacts/contracts/FHECounter.sol/FHECounter.json', 'utf8'));

// Create deployment files for localhost
const privateNFTDeployment = {
  address: "0x4B440984e8c8421d96dd6205C3A3Df8b1885Fe2e", // Address from deployment output
  abi: privateNFTArtifact.abi,
  transactionHash: "0x3faac4f232a33ce04a6e2ea06a0957e30d50db45df67898efad48e1472414b91",
  receipt: {
    to: null,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    contractAddress: "0xb7a0433292678a75ab16372df7E02A1cf55FCa86",
    transactionIndex: 1,
    gasUsed: "1314320",
    logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    blockHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
    transactionHash: "0x3faac4f232a33ce04a6e2ea06a0957e30d50db45df67898efad48e1472414b91",
    logs: [],
    blockNumber: 2,
    cumulativeGasUsed: "1314320",
    status: 1
  },
  args: [],
  bytecode: privateNFTArtifact.bytecode,
  deployedBytecode: privateNFTArtifact.deployedBytecode,
  linkReferences: {},
  deployedLinkReferences: {}
};

const fheCounterDeployment = {
  address: "0x37180D34aCEe7f5A83A7af84ec40675baED2368E", // Address from deployment output
  abi: fheCounterArtifact.abi,
  transactionHash: "0xb7bf5b6c7bb6121e4dfbdfb10d21f55e1b1ad71cc3ef57f1cdfb30a78b6729be",
  receipt: {
    to: null,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    contractAddress: "0xcdb52D431bEAd2108c40BffA39cc8231132881ee",
    transactionIndex: 0,
    gasUsed: "452971",
    logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    blockHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
    transactionHash: "0xb7bf5b6c7bb6121e4dfbdfb10d21f55e1b1ad71cc3ef57f1cdfb30a78b6729be",
    logs: [],
    blockNumber: 1,
    cumulativeGasUsed: "452971",
    status: 1
  },
  args: [],
  bytecode: fheCounterArtifact.bytecode,
  deployedBytecode: fheCounterArtifact.deployedBytecode,
  linkReferences: {},
  deployedLinkReferences: {}
};

// Write deployment files
fs.writeFileSync('./deployments/localhost/PrivateNFT.json', JSON.stringify(privateNFTDeployment, null, 2));
fs.writeFileSync('./deployments/localhost/FHECounter.json', JSON.stringify(fheCounterDeployment, null, 2));

console.log('Deployment files created successfully!');
