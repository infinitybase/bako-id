import { TransactionStatus, ZeroBytes32 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  MetadataContractFactory,
  RegistryContractFactory,
  StorageContractFactory,
} from '../src';
import {
  TestMetadataContract,
  TestRegistryContract,
  TestStorageContract,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  tryExecute,
  txParams,
} from './utils';

const metadataConfig = {
  github: {
    key: 'com.github',
    value: 'mygithubuser',
  },
  linkedin: {
    key: 'com.linkedin',
    value: 'mylinkuser',
  },
  user: {
    handle() {
      return randomName();
    },
  },
};

describe('Metadata contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;
  let metadata: TestMetadataContract;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: StorageContractFactory },
        { factory: RegistryContractFactory },
        { factory: MetadataContractFactory },
      ],
    });

    const {
      contracts: [storageAbi, registryAbi, metadataAbi],
      wallets: [deployer],
    } = node;

    storage = new TestStorageContract(storageAbi.id, deployer);
    registry = new TestRegistryContract(registryAbi.id, deployer);
    metadata = new TestMetadataContract(metadataAbi.id, deployer);

    await storage.initialize(deployer, registry.id.toB256());
    await registry.initialize({
      owner: deployer,
      managerId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    await metadata.initialize({ storageId: storage.id.toB256() });
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error on call method without started metadata contract', async () => {
    expect.assertions(2);

    const [owner] = node.wallets;
    const metadata = await TestMetadataContract.deploy(owner);

    try {
      await metadata.functions
        .save(
          metadataConfig.user.handle(),
          metadataConfig.github.key,
          metadataConfig.github.value
        )
        .addContracts([storage])
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should register a metadata for domain', async () => {
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    await registry.register({
      domain: handleName,
      period: 1,
      storageAbi: storage,
    });

    const saveFn = await metadata.functions
      .save(handleName, github.key, github.value)
      .txParams(txParams)
      .call();

    const { transactionResult } = await saveFn.waitForResult();

    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should error to register a metadata with other address of owner', async () => {
    expect.assertions(2);

    const [owner, fakeWallet] = node.wallets;

    const { github, user } = metadataConfig;
    const handleName = user.handle();

    await registry.register({
      period: 1,
      domain: handleName,
      storageAbi: storage,
    });

    try {
      metadata.account = fakeWallet;

      await metadata.functions
        .save(handleName, github.key, github.value)
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidPermission');
    } finally {
      metadata.account = owner;
    }
  });

  it('should get metadata by key', async () => {
    const [owner] = node.wallets;

    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const getGithubMetadata = async () => {
      const getFn = await metadata.functions
        .get(handleName, github.key)
        .txParams(txParams)
        .call();
      const { value } = await getFn.waitForResult();
      return value;
    };

    metadata.account = owner;

    await registry.register({
      period: 1,
      domain: handleName,
      storageAbi: storage,
    });

    const emptyMetadata = await getGithubMetadata();
    expect(emptyMetadata).toBe('');

    await metadata.functions
      .save(handleName, github.key, github.value)
      .txParams(txParams)
      .call();
    const metadataValue = await getGithubMetadata();

    expect(metadataValue).toBe(github.value);
  });

  it('should update metadata value', async () => {
    const [owner] = node.wallets;

    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const getGithubMetadata = async () => {
      const getFn = await metadata.functions
        .get(handleName, github.key)
        .txParams(txParams)
        .call();
      const { value } = await getFn.waitForResult();
      return value;
    };

    metadata.account = owner;

    await registry.register({
      period: 1,
      domain: handleName,
      storageAbi: storage,
    });

    await metadata.functions
      .save(handleName, github.key, github.value)
      .txParams(txParams)
      .call();
    expect(await getGithubMetadata()).toBe(github.value);

    const newValue = 'newgithubuser';
    await metadata.functions
      .save(handleName, github.key, newValue)
      .txParams(txParams)
      .call();
    expect(await getGithubMetadata()).toBe(newValue);
  });

  it('should update metadata values', async () => {
    const [owner] = node.wallets;

    const { github, linkedin, user } = metadataConfig;
    const handleName = user.handle();

    metadata.account = owner;

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

    const { waitForResult } = await metadata
      .multiCall([
        metadata.functions.save(handleName, github.key, github.value),
        metadata.functions.save(handleName, linkedin.key, linkedin.value),
      ])
      .call();

    const { logs } = await waitForResult();
    expect(logs).toHaveLength(2);
  });

  it('should get all metadata', async () => {
    const [owner] = node.wallets;
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = owner;

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

    const callFn = await metadata
      .multiCall([
        metadata.functions.save(handleName, github.key, github.value),
        metadata.functions.save(handleName, linkedin.key, linkedin.value),
      ])
      .txParams(txParams)
      .call();

    await callFn.waitForResult();

    const { value: metadataBytes } = await metadata.functions
      .get_all(handleName)
      .get();

    expect(metadataBytes).toHaveLength(52);
  });

  it('should save all metadatas', async () => {
    const [owner] = node.wallets;
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = owner;

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

    const metadatas = [
      { key: github.key, value: github.value },
      { key: linkedin.key, value: linkedin.value },
    ];

    const callFn = await metadata
      .multiCall(
        metadatas.map(({ key, value }) =>
          metadata.functions.save(handleName, key, value)
        )
      )
      .addContracts([storage])
      .call();

    const { transactionResult } = await callFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });
});
