import {
  Provider,
  TransactionStatus,
  type WalletUnlocked,
  ZeroBytes32,
} from 'fuels';
import {
  TestMetadataContract,
  TestRegistryContract,
  TestStorageContract,
  WALLET_PRIVATE_KEYS,
  createWallet,
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
  let wallet: WalletUnlocked;
  let provider: Provider;

  let storage: TestStorageContract;
  let registry: TestRegistryContract;
  let metadata: TestMetadataContract;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider);

    storage = await TestStorageContract.deploy(wallet);
    registry = await TestRegistryContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
      attestationId: ZeroBytes32,
    });
    metadata = await TestMetadataContract.startup({
      owner: wallet,
      storageId: storage.id.toB256(),
    });
    await storage.initialize(wallet, registry.id.toB256());
  });

  it('should error on call method without started metadata contract', async () => {
    expect.assertions(2);

    const metadata = await TestMetadataContract.deploy(wallet);

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
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

    expect.assertions(2);

    try {
      metadata.account = fakeWallet;

      await metadata.functions
        .save(handleName, github.key, github.value)
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidPermission');
    }
  });

  it('should get metadata by key', async () => {
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

    metadata.account = wallet;

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

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

    metadata.account = wallet;

    await tryExecute(
      registry.register({
        period: 1,
        domain: handleName,
        storageAbi: storage,
      })
    );

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
    const { github, linkedin, user } = metadataConfig;
    const handleName = user.handle();

    metadata.account = wallet;

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
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = wallet;

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
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = wallet;

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
