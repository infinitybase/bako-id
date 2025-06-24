import {
  Provider,
  Wallet,
  bn
} from 'fuels';
import { requireEnv } from "../node-only/index";
import { Marketplace } from "../src/artifacts";
import { callAndWait } from "../src/utils";
import { deployMarketplace, deployProxy, getAssetsConfig } from './utils';

const REGULAR_ETH_FEE = bn(10).mul(100); // 10%
const DISCOUNTED_ETH_FEE = bn(5).mul(100); // 5% (discounted when has Bako ID)

const env = {
  FUEL_PROVIDER_URL: requireEnv("PROVIDER_URL"),
  OWNER_PRIVATE_KEY: requireEnv("OWNER_PRIVATE_KEY"),
  MANAGER_PRIVATE_KEY: requireEnv("MANAGER_PRIVATE_KEY"),
};

const setup = () => {
  const provider = new Provider(env.FUEL_PROVIDER_URL);
  const manager = Wallet.fromPrivateKey(env.MANAGER_PRIVATE_KEY, provider);
  const account = Wallet.fromPrivateKey(env.OWNER_PRIVATE_KEY, provider);

  return {
    provider,
    manager,
    account,
  };
};

export const deployContractsEOA = async () => {
  const { provider, manager, account } = setup();

  const proxy = await deployProxy({
    provider,
    account,
    manager,
  });

  const marketplace = await deployMarketplace({
    provider,
    account,
    manager,
  });

  console.log("Setting proxy target...");
  await callAndWait(
    proxy.functions.set_proxy_target({ bits: marketplace.id.toB256() }),
  );

  const contract = new Marketplace(proxy.id, manager);

  try {
    console.log("Initializing marketplace...");
    await callAndWait(
      contract.functions.initialize({
        Address: { bits: account.address.toB256() },
      }),
    );
  } catch (e) {
    // @ts-ignore
    if (String(e.message).includes('CannotReinitialized')) {
      console.warn("Marketplace already initialized, skipping initialization.");
    }
  }

  console.log("Adding assets...");
  const assets = getAssetsConfig(await provider.getChainId());
  const batchCall = assets.map(asset =>
    contract.functions.add_valid_asset({ bits: asset.assetId }, [asset.baseFee, asset.discountedFee]));

  await callAndWait(marketplace.multiCall(batchCall));
  console.info("Assets added successfully.");

  return {
    proxy,
    marketplace,
  };
};