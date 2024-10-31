import { Provider, Wallet } from 'fuels';
import { config } from '../src/config';
import { connectContracts } from '../src/setup';
import { getTxParams } from '../src/utils';

require('dotenv').config();

const { PROVIDER_URL, STORAGE_ID, PRIVATE_KEY } = process.env;

const updataStorageRegistry = async () => {
  const provider = await Provider.create(PROVIDER_URL!);
  const mainWallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);
  const txParams = getTxParams(provider);
  const { registry, storage } = connectContracts({
    account: mainWallet,
    storageId: STORAGE_ID!,
    registryId: config.REGISTRY_CONTRACT_ID,
  });

  await storage.functions
    .set_implementation({
      bits: registry.id.toB256(),
    })
    .txParams(txParams)
    .call();

  await registry.functions
    .constructor(
      { bits: mainWallet.address.toB256() },
      { bits: storage.id.toB256() },
      { bits: config.ATTESTATION_CONTRACT_ID },
    )
    .txParams(txParams)
    .call();
};

updataStorageRegistry()
  .then(() => {
    console.log(`✅ Registry updated`);
  })
  .catch((e) => {
    console.log(`🚫 Error on update registry`, e);
  });
