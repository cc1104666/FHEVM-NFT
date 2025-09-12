import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedPrivateNFT = await deploy("PrivateNFT", {
    from: deployer,
    log: true,
  });

  console.log(`PrivateNFT contract: `, deployedPrivateNFT.address);
};
export default func;
func.id = "deploy_privateNFT"; // id required to prevent reexecution
func.tags = ["PrivateNFT"];
