import { connectContracts, getRegistryContract } from '../src/setup';
import { Provider, Wallet } from 'fuels';
import { envrionment } from '../src/config';
import { getTxParams } from '../src/utils';

require('dotenv').config();

const {
  PROVIDER_URL,
  STORAGE_ID,
  PRIVATE_KEY,
} = process.env;

const updataStorageRegistry = async () => {
  const provider = await Provider.create(PROVIDER_URL!);
  const mainWallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);
  const txParams = getTxParams(provider);
  const { registry, storage } = connectContracts({
    account: mainWallet,
    storageId: STORAGE_ID!,
    registryId: envrionment.REGISTRY_CONTRACT_ID,
  });

  await storage.functions.set_implementation({
    value: registry.id.toB256(),
  }).txParams(txParams).call();

  await registry.functions.constructor(
    { value: mainWallet.address.toB256() },
    { value: storage.id.toB256() })
    .txParams(txParams)
    .call();
};

updataStorageRegistry();
