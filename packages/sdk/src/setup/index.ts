import { Registry, contractsId } from '@bako-id/contracts';
import type { Account, Provider } from 'fuels';
import {
  AttestationContract,
  MetadataContract,
  RegistryContract,
  ResolverContract,
  StorageContract,
} from '../types';
import { getFakeAccount } from '../utils';

export interface ContractConfig {
  storageId: string;
  registryId?: string;
  metadataId?: string;
  resolverId?: string;
  attestationId?: string;
  account?: Account;
  provider?: Provider;
}

const connectContracts = (config: ContractConfig) => {
  if (!config.account || !config.registryId) {
    throw new Error(
      'Account and registryId are required to connect contracts.'
    );
  }
  const storage = new StorageContract(config.storageId, config.account);
  const registry = new RegistryContract(config.registryId, config.account);

  return {
    storage,
    registry,
    metadata: config.metadataId
      ? new MetadataContract(config.metadataId, config.account)
      : null,
    resolver: config.resolverId
      ? new ResolverContract(config.resolverId, config.account)
      : null,
    attestation: config.attestationId
      ? new AttestationContract(config.attestationId, config.account)
      : null,
  };
};

const getRegistryContract = async (config: ContractConfig) => {
  // const provider = config.provider || config.account?.provider;
  if (!config.account) {
    throw new Error('Provider is required to connect getRegistryContract.');
  }

  // const fakeAccount = getFakeAccount(provider);
  // const storage = new StorageContract(config.storageId, fakeAccount);
  // const { value: registryId } = await storage.functions
  //   .get_implementation()
  //   .txParams(getTxParams(provider))
  //   .get();
  //
  // if (!registryId) {
  //   throw new Error('Registry Contract not found.');
  // }

  const registry = new Registry(contractsId.testnet.registry, config.account);

  return {
    registry,
  };
};

export { connectContracts, getFakeAccount, getRegistryContract };
