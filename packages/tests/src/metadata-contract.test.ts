import { Provider, TransactionStatus, type WalletUnlocked } from 'fuels';
import {
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
  setupContractsAndDeploy,
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

  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/graphql');
    wallet = createWallet(provider);
    contracts = await setupContractsAndDeploy(wallet);

    await tryExecute(contracts.registry.initializeRegistry());
    await tryExecute(contracts.storage.initializeStorage());
  });

  it('should error on call method without started metadata contract', async () => {
    const { metadata } = contracts;

    expect.assertions(2);

    try {
      await metadata.functions
        .save(
          metadataConfig.user.handle(),
          metadataConfig.github.key,
          metadataConfig.github.value,
        )
        .txParams(txParams)
        .call();
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'StorageNotInitialized');
    }
  });

  it('should register a metadata for domain', async () => {
    const { metadata, registry } = contracts;
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    await tryExecute(metadata.initializeMetadata());

    await registry.register(handleName, wallet.address.toB256(), 1);

    const { transactionResult } = await metadata.functions
      .save(handleName, github.key, github.value)
      .txParams(txParams)
      .call();

    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should error to register a metadata with other address of owner', async () => {
    const { metadata, registry } = contracts;
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const fakeWallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    await tryExecute(metadata.initializeMetadata());
    await tryExecute(registry.register(handleName, wallet.address.toB256(), 1));

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
    const { metadata, registry } = contracts;
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const getGithubMetadata = async () => {
      const { value } = await metadata.functions
        .get(handleName, github.key)
        .txParams(txParams)
        .call();
      return value;
    };

    metadata.account = wallet;

    await tryExecute(metadata.initializeMetadata());
    await tryExecute(registry.register(handleName, wallet.address.toB256(), 1));

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
    const { metadata, registry } = contracts;
    const { github, user } = metadataConfig;
    const handleName = user.handle();

    const getGithubMetadata = async () => {
      const { value } = await metadata.functions
        .get(handleName, github.key)
        .txParams(txParams)
        .call();
      return value;
    };

    metadata.account = wallet;

    await tryExecute(metadata.initializeMetadata());
    await tryExecute(registry.register(handleName, wallet.address.toB256(), 1));

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

  it('should get all metadata', async () => {
    const { metadata, registry } = contracts;
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = wallet;

    await tryExecute(metadata.initializeMetadata());
    await tryExecute(registry.register(handleName, wallet.address.toB256(), 1));

    await metadata.functions
      .save(handleName, github.key, github.value)
      .txParams(txParams)
      .call();

    await metadata.functions
      .save(handleName, linkedin.key, linkedin.value)
      .txParams(txParams)
      .call();

    const { value: metadataBytes } = await metadata.functions
      .get_all(handleName)
      .get();

    expect(metadataBytes).toHaveLength(52);
  });

  it('should save all metadatas', async () => {
    const { metadata, registry, storage } = contracts;
    const { github, linkedin, user } = metadataConfig;

    const handleName = user.handle();

    metadata.account = wallet;

    await tryExecute(metadata.initializeMetadata());
    await tryExecute(registry.register(handleName, wallet.address.toB256(), 1));

    const metadatas = [
      { key: github.key, value: github.value },
      { key: linkedin.key, value: linkedin.value },
    ];

    try {
      await metadata
        .multiCall(
          metadatas.map(({ key, value }) =>
            metadata.functions.save(handleName, key, value),
          ),
        )
        .addContracts([storage])
        .call();
    } catch (error) {
      console.log('Error', { ...error });
    }
  });
});
