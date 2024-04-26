import { BaseAssetId, type WalletUnlocked } from 'fuels';
import {
  type MetadataContractAbi,
  MetadataContractAbi__factory,
  type RegistryContractAbi,
  RegistryContractAbi__factory,
  type ResolverContractAbi,
  ResolverContractAbi__factory,
  type StorageContractAbi,
  StorageContractAbi__factory,
  TestContractAbi__factory,
} from '../types';
import {
  metadataContract,
  registryContract,
  resolverContract,
  storageContract,
  testContract,
} from '../types/contract-ids.json';
import metadataHex from '../types/contracts/MetadataContractAbi.hex';
import registryHex from '../types/contracts/RegistryContractAbi.hex';
import resolverHex from '../types/contracts/ResolverContractAbi.hex';
import storageHex from '../types/contracts/StorageContractAbi.hex';
import { domainPrices, txParams } from './index';

const initializeStorage =
  (owner: string, registryId: string, contractAbi: StorageContractAbi) =>
  async (contractId = registryId) => {
    const { transactionResult: txProxy } = await contractAbi.functions
      .constructor({ value: owner }, { value: contractId })
      .txParams(txParams)
      .call();

    return { txProxy };
  };

const initializeRegistry =
  (owner: string, storageId: string, contractAbi: RegistryContractAbi) =>
  async () => {
    const { transactionResult: txRegistry } = await contractAbi.functions
      .constructor({ value: owner }, { value: storageId })
      .txParams(txParams)
      .call();

    return { txRegistry };
  };

const initializeMetadata =
  (storageId: string, contractAbi: MetadataContractAbi) => async () => {
    const { transactionResult: txRegistry } = await contractAbi.functions
      .constructor({ value: storageId })
      .txParams(txParams)
      .call();

    return { txRegistry };
  };

const initializeResolver =
  (storageId: string, contractAbi: ResolverContractAbi) => async () => {
    const { transactionResult: txRegistry } = await contractAbi.functions
      .constructor({ value: storageId })
      .txParams(txParams)
      .call();

    return { txRegistry };
  };

const register =
  (contractAbi: RegistryContractAbi, storageAbi: StorageContractAbi) =>
  async (domain: string, account: string, calculateAmount = true) => {
    const amount = domainPrices(domain);
    const callBuilder = contractAbi.functions.register(
      domain,
      account ?? contractAbi.account.address.toB256()
    );

    if (calculateAmount) {
      callBuilder.callParams({
        forward: { amount, assetId: BaseAssetId },
      });
    }

    return callBuilder.addContracts([storageAbi]).txParams(txParams).call();
  };

export async function setupContractsAndDeploy(wallet: WalletUnlocked) {
  const storage = await StorageContractAbi__factory.deployContract(
    storageHex,
    wallet
  );
  const registry = await RegistryContractAbi__factory.deployContract(
    registryHex,
    wallet
  );
  const metadata = await MetadataContractAbi__factory.deployContract(
    metadataHex,
    wallet
  );
  const resolver = await ResolverContractAbi__factory.deployContract(
    resolverHex,
    wallet
  );

  const connect = (wallet: WalletUnlocked) =>
    StorageContractAbi__factory.connect(storage.id, wallet);

  return {
    storage: Object.assign(storage, {
      initializeStorage: initializeStorage(
        wallet.address.toB256(),
        registry.id.toB256(),
        storage
      ),
      connect,
    }),
    registry: Object.assign(registry, {
      initializeRegistry: initializeRegistry(
        wallet.address.toB256(),
        storage.id.toB256(),
        registry
      ),
      register: register(registry, storage),
    }),
    metadata: Object.assign(metadata, {
      initializeMetadata: initializeMetadata(storage.id.toB256(), metadata),
    }),
    resolver: Object.assign(resolver, {
      initializeResolver: initializeResolver(storage.id.toB256(), resolver),
    }),
  };
}

export async function setupContracts(wallet: WalletUnlocked) {
  const storage = StorageContractAbi__factory.connect(storageContract, wallet);
  const registry = RegistryContractAbi__factory.connect(
    registryContract,
    wallet
  );
  const metadata = MetadataContractAbi__factory.connect(
    metadataContract,
    wallet
  );
  const resolver = ResolverContractAbi__factory.connect(
    resolverContract,
    wallet
  );
  const testCaller = TestContractAbi__factory.connect(testContract, wallet);

  return {
    storage: Object.assign(storage, {
      initializeStorage: initializeStorage(
        wallet.address.toB256(),
        registry.id.toB256(),
        storage
      ),
      connect: StorageContractAbi__factory.connect,
    }),
    registry: Object.assign(registry, {
      initializeRegistry: initializeRegistry(
        wallet.address.toB256(),
        storage.id.toB256(),
        registry
      ),
      register: register(registry, storage),
    }),
    resolver: Object.assign(resolver, {
      initializeResolver: initializeResolver(storage.id.toB256(), resolver),
    }),
    metadata,
    testCaller,
  };
}

export { testContract, storageContract, registryContract, metadataContract };
