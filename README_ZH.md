# 🎨 Private NFT Marketplace - FHEVM Demo

*[English Version / 英文版本](./README.md)*

一个基于 FHEVM (Fully Homomorphic Encryption Virtual Machine) 技术的隐私保护 NFT 铸造和管理应用。

## ✨ 功能特色

### 🔐 隐私保护
- **公开元数据**: 名称、描述、图片 URL 等公开可见信息
- **加密私有属性**: 稀有度、力量值、传奇状态等私密信息使用 FHEVM 加密存储
- **按需解密**: 只有 NFT 拥有者可以解密查看私有属性

### 🎯 核心功能
1. **NFT 铸造**: 创建具有公开和私有属性的 NFT
2. **收藏展示**: 查看拥有的 NFT 集合
3. **属性解密**: 解密查看 NFT 的隐私属性
4. **实时状态**: 显示合约状态、交易进度等信息

## 🏗️ 技术架构

### 智能合约层
- **PrivateNFT.sol**: 支持 FHEVM 加密属性的 NFT 合约
- **加密类型**: 使用 `euint32` 和 `ebool` 存储私有数据
- **权限控制**: 通过 FHEVM 的权限系统控制数据访问

### 前端技术栈
- **React 19 + Next.js 15**: 现代化前端框架
- **TypeScript**: 类型安全开发
- **Tailwind CSS**: 响应式 UI 设计
- **ethers.js**: 以太坊交互库

### FHEVM 集成
- **@zama-fhe/relayer-sdk**: FHEVM 客户端 SDK
- **加密输入**: 前端加密用户输入
- **解密签名**: 管理解密权限和签名

## 📁 项目结构

```
packages/site/
├── components/
│   ├── PrivateNFTDemo.tsx      # 主要演示组件
│   ├── NFTMintingForm.tsx      # NFT 铸造表单
│   ├── NFTGallery.tsx          # NFT 展示画廊
│   └── ErrorNotDeployed.tsx    # 错误处理组件
├── hooks/
│   ├── usePrivateNFT.tsx       # NFT 合约交互钩子
│   ├── useFHECounter.tsx       # 原始计数器钩子
│   └── metamask/               # MetaMask 钱包集成
├── fhevm/                      # FHEVM 核心模块
├── abi/                        # 自动生成的合约 ABI
└── scripts/
    └── genabi-nft.mjs          # NFT ABI 生成脚本

packages/fhevm-hardhat-template/
├── contracts/
│   ├── PrivateNFT.sol          # 私有 NFT 智能合约
│   └── FHECounter.sol          # 原始计数器合约
├── deploy/
│   └── deployPrivateNFT.ts     # NFT 合约部署脚本
└── deployments/localhost/      # 本地部署信息
```

## 🚀 快速开始

### 1. 环境准备
```bash
# 安装依赖
npm install

# 启动 Hardhat 节点（新终端）
cd packages/fhevm-hardhat-template
npx hardhat node --verbose

# 部署合约（新终端）
npx hardhat deploy --network localhost

# 生成 ABI
cd ../site
npm run genabi-nft
```

### 2. 启动应用
```bash
# 开发模式（支持 FHEVM 模拟）
npm run dev:mock

# 打开浏览器访问
# http://localhost:3000
```

### 3. MetaMask 配置
- **网络名称**: Hardhat
- **RPC URL**: http://127.0.0.1:8545
- **链 ID**: 31337
- **货币符号**: ETH

## 🎮 使用指南

### 铸造 NFT
1. 连接 MetaMask 钱包
2. 填写公开元数据（名称、描述、图片 URL）
3. 设置私有属性（稀有度、力量值、传奇状态）
4. 点击"Mint Private NFT"按钮
5. 确认 MetaMask 交易

### 查看收藏
1. 切换到"My Collection"标签
2. 查看拥有的 NFT 列表
3. 点击"Decrypt"按钮解密私有属性
4. 查看完整的 NFT 信息

## 🔍 特色演示

### 加密属性类型
- **稀有度 (Rarity)**: 1-100 的加密数值，表示 NFT 稀有程度
- **力量值 (Power)**: 1-1000 的加密数值，表示 NFT 力量等级
- **传奇状态 (Legendary)**: 加密布尔值，标记是否为传奇物品

### 预设模板
应用提供了三个预设的 NFT 模板：
1. **神秘巨龙**: 高稀有度传奇生物
2. **附魔之剑**: 中等稀有度武器
3. **力量水晶**: 低稀有度法器

### 用户界面特性
- **渐变设计**: 现代化的紫蓝色渐变主题
- **响应式布局**: 支持各种屏幕尺寸
- **实时反馈**: 交易状态和错误信息实时显示
- **调试信息**: 显示链信息、合约状态、FHEVM 状态

## 🛠️ 开发指南

### 添加新的加密属性
1. 在合约中定义新的加密类型
2. 更新 `PrivateNFTData` 结构体
3. 修改 mint 函数接受新参数
4. 在前端添加相应的 UI 控件

### 自定义 UI 组件
- 所有组件都使用 Tailwind CSS 设计
- 支持深色/浅色主题切换
- 可以轻松自定义颜色和样式

### 扩展合约功能
- 添加 NFT 转移功能
- 实现市场交易功能
- 支持批量操作

## 🔐 安全考虑

### FHEVM 安全特性
- 私有数据在区块链上始终保持加密状态
- 只有授权用户可以解密特定数据
- 使用 Zama 的 FHE 技术确保计算安全性

### 权限管理
- 每个 NFT 的私有数据只对其拥有者可见
- 合约部署者无法访问用户的私有数据
- 转移 NFT 时自动更新访问权限

## 🌟 未来改进

### 计划功能
- [ ] IPFS 集成存储元数据
- [ ] NFT 市场交易功能
- [ ] 批量铸造和管理
- [ ] 社交分享功能
- [ ] 移动端适配

### 技术优化
- [ ] Gas 费用优化
- [ ] 更好的错误处理
- [ ] 离线模式支持
- [ ] 多链支持

## 📚 学习资源

- [FHEVM 官方文档](https://docs.zama.ai/protocol/)
- [Zama FHE 技术介绍](https://zama.ai/)
- [以太坊开发指南](https://ethereum.org/developers/)
- [React 官方文档](https://react.dev/)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

BSD-3-Clause-Clear License

---

**这个项目展示了如何使用 FHEVM 技术构建隐私保护的 Web3 应用，为用户提供真正的数据隐私保护。**

*[English Version / 英文版本](./NFT_APP_README_EN.md)*

