import { BakoProvider, Vault } from 'bakosafe';
import { Wallet } from 'fuels';
import { requireEnv } from '../node-only';
import { Marketplace } from '../src/artifacts';
import { _getContractId, callAndWait } from '../src/utils';
import { getAssetsConfig } from './utils';

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

const addAssetsSafe = async () => {
  const { provider, account } = await setup();
  const chainId = await provider.getChainId();

  const assets = getAssetsConfig(chainId);

  const contractId = _getContractId(chainId, "marketplace");
  const marketplace = new Marketplace(contractId, account);

  console.log("Adding assets...");
  const batchCall = assets.map(asset =>
    marketplace.functions.add_valid_asset({ bits: asset.assetId }, [asset.baseFee, asset.discountedFee]));

  await callAndWait(marketplace.multiCall(batchCall));
  console.info("Assets added successfully.");
}

export { addAssetsSafe };
