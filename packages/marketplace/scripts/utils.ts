import { Account, Provider, Src14OwnedProxy, Src14OwnedProxyFactory, ZeroBytes32 } from 'fuels';
import { _getContractId, callAndWait, ContractsMap } from '../src/utils';
import { MarketplaceFactory } from '../src/artifacts';
import bakoContracts from '../../contracts/src/artifacts/contracts-fuel.json';
import path from 'node:path';
import fs from 'node:fs';

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