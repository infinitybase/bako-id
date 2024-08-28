import { type Contract, type WalletUnlocked, bn } from 'fuels';
import {
  type AttestationContractAbi,
  AttestationContractAbi__factory,
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
  attestationContract,
  metadataContract,
  registryContract,
  resolverContract,
  storageContract,
  testContract,
} from '../types/contract-ids.json';
import attestationHex from '../types/contracts/AttestationContractAbi.hex';
import metadataHex from '../types/contracts/MetadataContractAbi.hex';
import registryHex from '../types/contracts/RegistryContractAbi.hex';
import resolverHex from '../types/contracts/ResolverContractAbi.hex';
import storageHex from '../types/contracts/StorageContractAbi.hex';
import { domainPrices, txParams } from './index';

const initializeStorage =
  (owner: string, registryId: string, contractAbi: StorageContractAbi) =>
  async (contractId = registryId) => {
    const callFn = await contractAbi.functions
      .constructor({ bits: owner }, { bits: contractId })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    return { txProxy: transactionResult };
  };

const initializeRegistry =
  (
    owner: string,
    storageId: string,
    attestationId: string,
    contractAbi: RegistryContractAbi,
  ) =>
  async () => {
    const callFn = await contractAbi.functions
      .constructor(
        { bits: owner },
        { bits: storageId },
        { bits: attestationId },
      )
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    return { txRegistry: transactionResult };
  };

const initializeMetadata =
  (storageId: string, contractAbi: MetadataContractAbi) => async () => {
    const callFn = await contractAbi.functions
      .constructor({ bits: storageId })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    return { txRegistry: transactionResult };
  };

const initializeResolver =
  (storageId: string, contractAbi: ResolverContractAbi) => async () => {
    const callFn = await contractAbi.functions
      .constructor({ bits: storageId })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    return { txRegistry: transactionResult };
  };

const initializeAttestation =
  (storageId: string, contractAbi: AttestationContractAbi) => async () => {
    const callFn = await contractAbi.functions
      .constructor({ bits: storageId })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    return { txRegistry: transactionResult };
  };

const register =
  (contractAbi: RegistryContractAbi, storageAbi: StorageContractAbi) =>
  async (
    domain: string,
    account: string,
    period: number,
    calculateAmount = true,
    attestationKey?: string,
  ) => {
    const amount = domainPrices(domain, period);
    //@ts-ignore
    const callBuilder = contractAbi.functions.register(
      domain,
      account ?? contractAbi.account.address.toB256(),
      period,
      attestationKey,
    );

    if (calculateAmount) {
      callBuilder.callParams({
        forward: { amount, assetId: contractAbi.provider.getBaseAssetId() },
      });
    } else {
      callBuilder.callParams({
        forward: {
          amount: bn(0),
          assetId: contractAbi.provider.getBaseAssetId(),
        },
      });
    }

    const fn = await callBuilder
      .addContracts([storageAbi])
      .txParams(txParams)
      .call();
    return fn.waitForResult();
  };

type DeployedContract<ABI extends Contract> = Awaited<Promise<ABI>>;
type Contracts = [
  DeployedContract<StorageContractAbi>,
  DeployedContract<RegistryContractAbi>,
  DeployedContract<MetadataContractAbi>,
  DeployedContract<ResolverContractAbi>,
  DeployedContract<AttestationContractAbi>,
];
export async function setupContractsAndDeploy(wallet: WalletUnlocked) {
  const contractsSetup = [
    await StorageContractAbi__factory.deployContract(storageHex, wallet),
    await RegistryContractAbi__factory.deployContract(registryHex, wallet),
    await MetadataContractAbi__factory.deployContract(metadataHex, wallet),
    await ResolverContractAbi__factory.deployContract(resolverHex, wallet),
    await AttestationContractAbi__factory.deployContract(
      attestationHex,
      wallet,
    ),
  ];

  const [storage, registry, metadata, resolver, attestation] =
    (await Promise.all(
      contractsSetup.map(async (contract) => {
        const result = await contract.waitForResult();
        return result.contract;
      }),
    )) as Contracts;

  const connect = (wallet: WalletUnlocked) =>
    StorageContractAbi__factory.connect(storage.id, wallet);

  return {
    storage: Object.assign(storage, {
      initializeStorage: initializeStorage(
        wallet.address.toB256(),
        registry.id.toB256(),
        storage,
      ),
      connect,
    }),
    registry: Object.assign(registry, {
      initializeRegistry: initializeRegistry(
        wallet.address.toB256(),
        storage.id.toB256(),
        attestation.id.toB256(),
        registry,
      ),
      register: register(registry, storage),
    }),
    metadata: Object.assign(metadata, {
      initializeMetadata: initializeMetadata(storage.id.toB256(), metadata),
    }),
    resolver: Object.assign(resolver, {
      initializeResolver: initializeResolver(storage.id.toB256(), resolver),
    }),
    attestation: Object.assign(attestation, {
      initializeAttestation: initializeAttestation(
        storage.id.toB256(),
        attestation,
      ),
    }),
  };
}

export async function setupContracts(wallet: WalletUnlocked) {
  const storage = StorageContractAbi__factory.connect(storageContract, wallet);
  const registry = RegistryContractAbi__factory.connect(
    registryContract,
    wallet,
  );
  const metadata = MetadataContractAbi__factory.connect(
    metadataContract,
    wallet,
  );
  const resolver = ResolverContractAbi__factory.connect(
    resolverContract,
    wallet,
  );
  const testCaller = TestContractAbi__factory.connect(testContract, wallet);
  const attestation = AttestationContractAbi__factory.connect(
    attestationContract,
    wallet,
  );

  return {
    storage: Object.assign(storage, {
      initializeStorage: initializeStorage(
        wallet.address.toB256(),
        registry.id.toB256(),
        storage,
      ),
      connect: StorageContractAbi__factory.connect,
    }),
    registry: Object.assign(registry, {
      initializeRegistry: initializeRegistry(
        wallet.address.toB256(),
        storage.id.toB256(),
        attestation.id.toB256(),
        registry,
      ),
      register: register(registry, storage),
    }),
    resolver: Object.assign(resolver, {
      initializeResolver: initializeResolver(storage.id.toB256(), resolver),
    }),
    metadata,
    testCaller,
    attestation: Object.assign(attestation, {
      initializeAttestation: initializeAttestation(
        storage.id.toB256(),
        attestation,
      ),
    }),
  };
}

export { metadataContract, registryContract, storageContract, testContract };
