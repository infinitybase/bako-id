import {
  Provider,
  Src14OwnedProxy,
  Src14OwnedProxyFactory,
  Wallet,
  ZeroBytes32,
  bn,
} from "fuels";
import fs from "node:fs";
import path from "node:path";
import bakoContracts from "../../contracts/src/artifacts/contracts-fuel.json";
import { MarketplaceFactory } from "../src/artifacts";
import { callAndWait, requireEnv } from "../src/utils";

const CONTRACTS_FILE = "contract.json";
const CONTRACTS_PATH = path.join(__dirname, "..", "src", "artifacts");
const REGULAR_ETH_FEE = bn(10).mul(100); // 10%
const DISCOUNTED_ETH_FEE = bn(5).mul(100); // 5% (discounted when has Bako ID)

const env = {
  FUEL_PROVIDER_URL: requireEnv("PROVIDER_URL"),
  PROXY_PRIVATE_KEY: requireEnv("PROXY_PRIVATE_KEY"),
  MARKETPLACE_PRIVATE_KEY: requireEnv("MARKETPLACE_PRIVATE_KEY"),
};

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

const getContractAddress = (name: string, chainId: number) => {
  const contractPath = path.join(CONTRACTS_PATH, CONTRACTS_FILE);

  if (!fs.existsSync(contractPath)) {
    fs.writeFileSync(contractPath, JSON.stringify({}));
  }

  const contracts = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  return contracts[chainId]?.[name];
};

const setContractAddress = (name: string, chainId: number, address: string) => {
  const contractPath = path.join(CONTRACTS_PATH, CONTRACTS_FILE);
  const contracts = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  contracts[chainId] = contracts[chainId] || {};
  contracts[chainId][name] = address;
  fs.writeFileSync(contractPath, JSON.stringify(contracts, null, 2));
};

const setup = () => {
  const provider = new Provider(env.FUEL_PROVIDER_URL);
  const proxyWallet = Wallet.fromPrivateKey(env.PROXY_PRIVATE_KEY, provider);
  const marketplaceWallet = Wallet.fromPrivateKey(env.MARKETPLACE_PRIVATE_KEY, provider);

  return {
    provider,
    proxyWallet,
    marketplaceWallet,
  };
};

const deployProxy = async () => {
  const { proxyWallet, provider } = setup();
  const proxyAddress = getContractAddress("proxy", await provider.getChainId());

  if (proxyAddress) {
    console.log("Proxy already deployed:", proxyAddress);
    return new Src14OwnedProxy(proxyAddress, proxyWallet);
  }

  console.log("Deploying proxy...");
  const proxyDeployment = await Src14OwnedProxyFactory.deploy(proxyWallet, {
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
    "proxy",
    await provider.getChainId(),
    contract.id.toB256(),
  );

  console.log("Proxy deployed:", contract.id.toB256());

  return contract;
};

const deployMarketplace = async () => {
  const { marketplaceWallet, provider } = setup();
  const baseAssetId = await provider.getBaseAssetId();

  console.log("Deploying marketplace...");
  const chainId = await provider.getChainId();
  const resolverContractId = getResolverContractId(chainId);

  const marketplaceDeployment = await MarketplaceFactory.deploy(
    marketplaceWallet,
    {
      configurableConstants: {
        RESOLVER_CONTRACT_ID: resolverContractId,
      },
    },
  );
  const { contract } = await marketplaceDeployment.waitForResult();

  console.log("Initializing marketplace...");
  await callAndWait(
    contract.functions.initialize({
      Address: { bits: marketplaceWallet.address.toB256() },
    }),
  );

  await callAndWait(contract.functions.add_valid_asset({ bits: baseAssetId }, [REGULAR_ETH_FEE, DISCOUNTED_ETH_FEE]));
  console.info(`Marketplace added baseAssetId with fees: ${REGULAR_ETH_FEE.toString()}, ${DISCOUNTED_ETH_FEE.toString()}`);

  console.log("Marketplace deployed:", contract.id.toB256());

  setContractAddress(
    "marketplace",
    await provider.getChainId(),
    contract.id.toB256(),
  );

  return contract;
};

export const deployContracts = async () => {
  const proxy = await deployProxy();
  const marketplace = await deployMarketplace();

  console.log("Setting proxy target...");
  await callAndWait(
    proxy.functions.set_proxy_target({ bits: marketplace.id.toB256() }),
  );

  return {
    proxy,
    marketplace,
  };
};

deployContracts();