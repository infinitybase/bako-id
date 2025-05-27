import {
  Provider,
  Wallet,
  bn
} from 'fuels';
import { requireEnv } from "../node-only/index";
import { Marketplace } from "../src/artifacts";
import { callAndWait } from "../src/utils";
import { deployMarketplace, deployProxy } from './utils';
import { BakoProvider, Vault } from 'bakosafe';

const REGULAR_ETH_FEE = bn(10).mul(100); // 10%
const DISCOUNTED_ETH_FEE = bn(5).mul(100); // 5% (discounted when has Bako ID)

const env = {
  SAFE_API_TOKEN: requireEnv("SAFE_API_TOKEN"),
  FUEL_PROVIDER_URL: requireEnv("PROVIDER_URL"),
  MANAGER_PRIVATE_KEY: requireEnv("MANAGER_PRIVATE_KEY"),
};

const setup = async () => {
  const provider = await BakoProvider.create(env.FUEL_PROVIDER_URL, {
    apiToken: env.SAFE_API_TOKEN,
  });
  const vault = new Vault(provider);
  const manager = Wallet.fromPrivateKey(env.MANAGER_PRIVATE_KEY, provider);

  return {
    provider,
    manager,
    account: vault,
  };
};

export const deployContractsSafe = async () => {
  const { provider, manager, account } = await setup();

  const proxy = await deployProxy({
    provider,
    account,
    manager
  });

  const marketplace = await deployMarketplace({
    provider,
    account,
    manager,
  });

  const baseAssetId = await provider.getBaseAssetId();

  proxy.account = account;

  console.log("Setting proxy target...");
  await callAndWait(
    proxy.functions.set_proxy_target({ bits: marketplace.id.toB256() }),
  );

  const contract = new Marketplace(proxy.id, manager);

  try {
    console.log("Initializing marketplace...");
    await callAndWait(
      contract.functions.initialize({
        Address: { bits: manager.address.toB256() },
      }),
    );
  } catch (e) {
    // @ts-ignore
    if (String(e.message).includes('CannotReinitialized')) {
      console.warn("Marketplace already initialized, skipping initialization.");
    }
  }

  await callAndWait(contract.functions.add_valid_asset({ bits: baseAssetId }, [REGULAR_ETH_FEE, DISCOUNTED_ETH_FEE]));
  console.info(`Marketplace added baseAssetId with fees: ${REGULAR_ETH_FEE.toString()}, ${DISCOUNTED_ETH_FEE.toString()}`);

  return {
    proxy,
    marketplace,
  };
};