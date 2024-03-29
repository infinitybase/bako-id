require('dotenv').config();

import { deployContracts } from './deploy-contract';
import { Provider, Wallet } from 'fuels';
import { envrionment } from '../src/config';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

const initializeContracts = async () => {
  const provider = await Provider.create(PROVIDER_URL!);
  const mainWallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);

  await deployContracts({
    account: mainWallet,
    storageId: envrionment.STORAGE_CONTRACT_ID!,
    registryId: envrionment.REGISTRY_CONTRACT_ID
  });
};

initializeContracts()
  .then(() => {
    console.log('✅  Contracts initialized successfully');
  })
  .catch((e) => {
    console.error(`❌  Error initializing contracts: `, e);
    throw e;
  });
