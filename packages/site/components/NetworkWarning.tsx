"use client";

interface NetworkWarningProps {
  currentChainId: number | undefined;
  expectedChainId: number;
  onSwitchNetwork?: () => void;
}

export const NetworkWarning: React.FC<NetworkWarningProps> = ({
  currentChainId,
  expectedChainId,
  onSwitchNetwork: _onSwitchNetwork,
}) => {
  if (currentChainId === expectedChainId) {
    return null;
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return "以太坊主网";
      case 11155111: return "Sepolia 测试网";
      case 31337: return "Hardhat 本地网络";
      default: return `网络 ${chainId}`;
    }
  };

  const addHardhatNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7A69', // 31337 in hex
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
            blockExplorerUrls: null,
          }],
        });
      } catch (error) {
        console.error('添加网络失败:', error);
      }
    }
  };

  return (
    <div className="mx-4 lg:mx-20 mb-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              ⚠️ 网络不匹配
            </h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>
                <strong>当前网络:</strong> {getNetworkName(currentChainId || 0)} ({currentChainId})
              </p>
              <p>
                <strong>需要网络:</strong> {getNetworkName(expectedChainId)} ({expectedChainId})
              </p>
              <p className="mt-3">
                此应用需要连接到 <strong>Hardhat 本地网络</strong> 才能正常工作。
                合约已部署在本地测试网络上。
              </p>
            </div>
            <div className="mt-4 space-x-3">
              <button
                onClick={addHardhatNetwork}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加 Hardhat 网络
              </button>
              <div className="inline-flex items-center text-sm text-yellow-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                然后手动切换到 Hardhat Local 网络
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
