import { Account, bn, Provider, Src14OwnedProxy, Src14OwnedProxyFactory, ZeroBytes32 } from 'fuels';
import fs from 'node:fs';
import path from 'node:path';
import bakoContracts from '../../contracts/src/artifacts/contracts-fuel.json';
import { MarketplaceFactory } from '../src/artifacts';
import { _getContractId, callAndWait, ContractsMap } from '../src/utils';

const CONTRACTS_FILE = "contract.json";
const CONTRACTS_PATH = path.join(__dirname, "..", "src", "artifacts");

type DeployConfig = {
  provider: Provider,
  account: Account,
  manager: Account,
}

type Network = keyof typeof bakoContracts;

const getNetwork = (chainId: number): Network => {
  if (chainId === 0) {
    return 'testnet';
  }
  return 'mainnet';
}

const getResolverContractId = (chainId: number) => {
  const network = getNetwork(chainId);
  return bakoContracts[network]?.resolver;
};

const setContractAddress = (name: string, chainId: number, address: string) => {
  const contractPath = path.join(CONTRACTS_PATH, CONTRACTS_FILE);
  const contracts = JSON.parse(fs.readFileSync(contractPath, "utf8")) as ContractsMap;
  contracts[chainId.toString()] = contracts[chainId.toString()] || {};
  contracts[chainId.toString()][name] = address;
  fs.writeFileSync(contractPath, JSON.stringify(contracts, null, 2));
};

export const deployProxy = async (config: DeployConfig) => {
  const { account: proxyWallet, manager, provider } = config;
  const proxyAddress = _getContractId(await provider.getChainId(), "marketplace");

  if (proxyAddress) {
    console.log("Proxy already deployed:", proxyAddress);
    return new Src14OwnedProxy(proxyAddress, proxyWallet);
  }

  console.log("Deploying proxy...");
  const proxyDeployment = await Src14OwnedProxyFactory.deploy(manager, {
    configurableConstants: {
      INITIAL_TARGET: { bits: ZeroBytes32 },
      INITIAL_OWNER: {
        Initialized: { Address: { bits: proxyWallet.address.toB256() } },
      },
    },
  });

  const { contract } = await proxyDeployment.waitForResult();

  console.log("Initializing proxy...");
  await callAndWait(contract.functions.initialize_proxy());

  setContractAddress(
    "marketplace",
    await provider.getChainId(),
    contract.id.toB256(),
  );

  console.log("Proxy deployed:", contract.id.toB256());

  return contract;
};

export const deployMarketplace = async (config: DeployConfig) => {
  const { manager, provider } = config;

  console.log("Deploying marketplace...");
  const chainId = await provider.getChainId();
  const resolverContractId = getResolverContractId(chainId);

  const marketplaceDeployment = await MarketplaceFactory.deploy(
    manager,
    {
      configurableConstants: {
        RESOLVER_CONTRACT_ID: resolverContractId,
      },
    },
  );
  const { contract } = await marketplaceDeployment.waitForResult();

  console.log("Marketplace deployed:", contract.id.toB256());

  return contract;
};

export const mainnetAssets = [
  {
    // Fuel
    assetId: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
    baseFee: bn(4).mul(100),
    discountedFee: bn(3).mul(100)
  },
  {
    // USDC
    assetId: '0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b',
    baseFee: bn(4).mul(100),
    discountedFee: bn(3).mul(100)
  },
  {
    // USDT
    assetId: '0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e',
    baseFee: bn(4).mul(100),
    discountedFee: bn(3).mul(100)
  },
  {
    // ETH
    assetId: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
    baseFee: bn(4).mul(100),
    discountedFee: bn(3).mul(100)
  },
];

export const getAssetsConfig = (chainId: number) => {
  if (chainId === 9889) {
    return mainnetAssets;
  }

  return [
    {
      // ETH
      assetId: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
      baseFee: bn(4).mul(100),
      discountedFee: bn(3).mul(100)
    },
    {
      // FUEL
      assetId: '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b',
      baseFee: bn(1).mul(100), // 1%
      discountedFee: bn(0).mul(100) // 0%
    }
  ]
}