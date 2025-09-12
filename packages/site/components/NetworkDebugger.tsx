"use client";

import { useEffect, useState } from "react";

export const NetworkDebugger = () => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshNetworkInfo = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const networkVersion = await window.ethereum.request({ method: 'net_version' });
        
        const info = {
          chainId: chainId,
          chainIdDecimal: parseInt(chainId, 16),
          accounts: accounts.slice(0, 1), // Only first account for privacy
          networkVersion,
          timestamp: new Date().toISOString()
        };
        
        setNetworkInfo(info);
        console.log('Network Info Refreshed:', info);
      } catch (error) {
        console.error('Failed to get network info:', error);
      }
    }
    setRefreshCount(prev => prev + 1);
  };

  useEffect(() => {
    refreshNetworkInfo();
    
    // Listen for network changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        console.log('Chain changed to:', chainId, 'decimal:', parseInt(chainId, 16));
        refreshNetworkInfo();
      };
      
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts.slice(0, 1));
        refreshNetworkInfo();
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  if (!networkInfo) {
    return (
      <div className="mx-4 lg:mx-20 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">正在获取网络信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 lg:mx-20 mb-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-800">网络调试信息</h3>
          <button
            onClick={refreshNetworkInfo}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            刷新 ({refreshCount})
          </button>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Chain ID (Hex):</strong> {networkInfo.chainId}</p>
          <p><strong>Chain ID (Decimal):</strong> {networkInfo.chainIdDecimal}</p>
          <p><strong>Network Version:</strong> {networkInfo.networkVersion}</p>
          <p><strong>Connected Account:</strong> {networkInfo.accounts[0] || 'None'}</p>
          <p><strong>Last Updated:</strong> {new Date(networkInfo.timestamp).toLocaleTimeString()}</p>
          <p><strong>Expected Chain:</strong> 11155111 (Sepolia)</p>
          <p><strong>Status:</strong> 
            <span className={networkInfo.chainIdDecimal === 11155111 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {networkInfo.chainIdDecimal === 11155111 ? ' ✅ 正确的网络' : ' ❌ 错误的网络'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
