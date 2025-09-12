const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Checking account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Check if we have enough for deployment (at least 0.01 ETH)
  const minBalance = ethers.parseEther("0.01");
  if (balance < minBalance) {
    console.log("❌ Insufficient balance for deployment. Need at least 0.01 ETH");
    console.log("💡 Please add some Sepolia ETH to your account:");
    console.log("   - Sepolia Faucet: https://sepoliafaucet.com/");
    console.log("   - Alchemy Faucet: https://sepoliafaucet.com/");
  } else {
    console.log("✅ Sufficient balance for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
