import { Wallet, type Account, type Provider } from 'fuels';
import { createFakeWallet } from '../test';
import {
  MetadataContractAbi__factory,
  RegistryContractAbi__factory,
  StorageContractAbi__factory,
} from '../types';
import { getFakeAccount, getTxParams } from '../utils';

export interface ContractConfig {
  storageId: string;
  registryId?: string;
  metadataId?: string;
  resolverId?: string;
  account?: Account;
  provider?: Provider;
}

const connectContracts = (config: ContractConfig) => {
  if (!config.account || !config.registryId) {
    throw new Error(
      'Account and registryId are required to connect contracts.',
    );
  }
  const storage = StorageContractAbi__factory.connect(
    config.storageId,
    config.account,
  );
  const registry = RegistryContractAbi__factory.connect(
    config.registryId,
    config.account,
  );

  return {
    storage,
    registry,
    metadata: config.metadataId
      ? MetadataContractAbi__factory.connect(config.metadataId, config.account)
      : null,
    resolver: config.resolverId
      ? MetadataContractAbi__factory.connect(config.resolverId, config.account)
      : null,
  };
};

const getRegistryContract = async (config: ContractConfig) => {
  const provider = config.provider || config.account?.provider;
  if (!provider) {
    throw new Error('Provider is required to connect getRegistryContract.');
  }
  const { TEST_WALLET } = process.env;

  const wallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);

  const fakeAccount = await createFakeWallet(provider, wallet, '10');
  const storage = StorageContractAbi__factory.connect(
    config.storageId,
    fakeAccount,
  );
  const { value: registryId } = await storage.functions
    .get_implementation()
    .txParams(getTxParams(provider))
    .dryRun();

  if (!registryId) {
    throw new Error('Registry Contract not found.');
  }

  const registry = RegistryContractAbi__factory.connect(
    registryId.value,
    fakeAccount,
  );

  return {
    storage,
    registry,
  };
};

export { connectContracts, getFakeAccount, getRegistryContract };
