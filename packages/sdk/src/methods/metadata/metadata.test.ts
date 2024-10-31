import {
  Provider,
  TransactionStatus,
  Wallet,
  type WalletUnlocked,
} from 'fuels';
import { createFakeWallet } from '../../test';
import { NotOwnerError, randomName } from '../../utils';
import { register } from '../register';
import { UserMetadataContract } from './index';

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

describe('Test metadata', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  const metadataConfig = {
    gihtub: {
      key: 'github',
      value: 'mygithub',
    },
    linkedin: {
      key: 'linkedin',
      value: 'mylinkedin',
    },
  };

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);
  });

  it('should save handle metadata', async () => {
    const domain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    const userMetadataContract = UserMetadataContract.initialize(
      wallet,
      domain
    );
    const { transactionResult } = await userMetadataContract.saveMetadata(
      metadataConfig.gihtub
    );

    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should error on save handle with account is not owner', async () => {
    const domain = randomName();
    const fakeWallet = await createFakeWallet(provider, '0.01');

    expect.assertions(1);

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    try {
      const userMetadataContract = UserMetadataContract.initialize(
        fakeWallet,
        domain
      );
      await userMetadataContract.saveMetadata(metadataConfig.gihtub);
    } catch (error) {
      expect(error).toBeInstanceOf(NotOwnerError);
    }
  });

  it('should get metadata of user by key', async () => {
    const domain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });
    const userMetadataContract = UserMetadataContract.initialize(
      wallet,
      domain
    );

    // Add github metadata
    const githubResult = await userMetadataContract.saveMetadata(
      metadataConfig.gihtub
    );
    expect(githubResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    // Add linkedin metadata
    const linkedinResult = await userMetadataContract.saveMetadata(
      metadataConfig.linkedin
    );
    expect(linkedinResult.transactionResult.status).toBe(
      TransactionStatus.success
    );

    // Get github metadata
    const githubMetadata = await userMetadataContract.getMetadata(
      metadataConfig.gihtub.key
    );
    expect(githubMetadata).toEqual(metadataConfig.gihtub);

    // Get linkedin metadata
    const linkedinMetadata = await userMetadataContract.getMetadata(
      metadataConfig.linkedin.key
    );
    expect(linkedinMetadata).toEqual(metadataConfig.linkedin);
  });

  it('should get all metadata of user', async () => {
    const domain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    const userMetadataContract = UserMetadataContract.initialize(
      wallet,
      domain
    );

    // Add github metadata
    await userMetadataContract.saveMetadata(metadataConfig.gihtub);

    // Add linkedin metadata
    await userMetadataContract.saveMetadata(metadataConfig.linkedin);

    const metadata = await userMetadataContract.getAll();
    expect(metadata).toEqual([metadataConfig.gihtub, metadataConfig.linkedin]);
  });

  it('should batch save metadata', async () => {
    const domain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
    });

    const userMetadataContract = UserMetadataContract.initialize(
      wallet,
      domain
    );

    const metadata = [metadataConfig.gihtub, metadataConfig.linkedin];

    const { transactionResult } =
      await userMetadataContract.batchSaveMetadata(metadata);

    expect(transactionResult.status).toBe(TransactionStatus.success);
  });
});
