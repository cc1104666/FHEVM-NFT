"use client";

import { useEffect } from "react";

interface AutoNetworkSwitchProps {
  currentChainId: number | undefined;
  expectedChainId: number;
  provider: any;
}

export const AutoNetworkSwitch: React.FC<AutoNetworkSwitchProps> = ({
  currentChainId,
  expectedChainId,
  provider,
}) => {
  const addAndSwitchToSepoliaNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // 首先尝试切换到 Sepolia 网络
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
        });
      } catch (switchError: any) {
        // 如果网络不存在，添加网络
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xAA36A7', // 11155111 in hex
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia Ethereum',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              }],
            });
          } catch (addError) {
            console.error('添加 Sepolia 网络失败:', addError);
            throw addError;
          }
        } else {
          console.error('切换网络失败:', switchError);
          throw switchError;
        }
      }
    }
  };

  // 页面加载时自动尝试切换到正确网络
  useEffect(() => {
    if (currentChainId && currentChainId !== expectedChainId && provider) {
      console.log(`当前网络: ${currentChainId}, 期望网络: ${expectedChainId}`);
      
      const autoSwitch = async () => {
        try {
          console.log('正在尝试自动切换到 Sepolia 网络...');
          await addAndSwitchToSepoliaNetwork();
          console.log('网络切换成功！');
        } catch (error) {
          console.log('自动切换网络失败，用户需要手动操作:', error);
        }
      };
      
      // 延迟执行，避免过早触发
      const timer = setTimeout(autoSwitch, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentChainId, expectedChainId, provider]);

  // 如果用户在主网，显示明确的切换提示
  if (currentChainId === 1) {
    return (
      <div className="mx-4 lg:mx-20 mb-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                ⚠️ 网络错误：当前连接到以太坊主网
              </h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>
                  <strong>当前网络:</strong> 以太坊主网 (chainId: 1)
                </p>
                <p>
                  <strong>需要网络:</strong> Sepolia 测试网 (chainId: 11155111)
                </p>
                <p className="mt-3">
                  此应用需要连接到 <strong>Sepolia 测试网</strong> 才能正常工作。
                  合约已部署在 Sepolia 测试网上。
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={addAndSwitchToSepoliaNetwork}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  切换到 Sepolia 测试网
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // 这是一个无UI的组件，只负责逻辑
};
