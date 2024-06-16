import { Provider, Wallet, type WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { createFakeWallet } from '../test';
import {
  InvalidDomainError,
  NotFoundBalanceError,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from '../utils';
import { editResolver } from './register';

const { PROVIDER_URL, TEST_WALLET } = process.env;

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;
  let fakeWallet: WalletUnlocked;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);
    wallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);
    fakeWallet = await createFakeWallet(provider, wallet);
  });

  it.each(['bako@', '#bako', 'bako name', 'bakONamE'])(
    'should error when register domain with invalid character %s',
    async (domain) => {
      const invalidSuffix = register({
        account: wallet,
        resolver: wallet.address.toB256(),
        domain: domain,
        period: 1,
      });

      await expect(invalidSuffix).rejects.toBeInstanceOf(InvalidDomainError);
    },
  );

  it('should register domain with special characters', async () => {
    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `bako_${randomName(3)}`,
      period: 1,
    });

    expect(result.transactionResult).toBeDefined();
  });

  it('should register domain and get resolver', async () => {
    const domain = randomName();

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain,
      period: 1,
    });

    expect(result.transactionResult.status).toBe('success');

    const resolverAddress = await resolver(domain, {
      provider,
    });
    expect(resolverAddress).toBe(wallet.address.toB256());

    const ownerAddress = await resolver(domain, {
      provider,
    });
    expect(ownerAddress).toBe(wallet.address.toB256());
  });

  it('should error when register domain without balance', async () => {
    const registerResult = register({
      account: fakeWallet,
      resolver: wallet.address.toB256(),
      domain: `do${randomName(1)}`,
      period: 1,
    });

    await expect(registerResult).rejects.toBeInstanceOf(NotFoundBalanceError);
  });

  it('should be able to register domain with 2 years', async () => {
    const domain = randomName(1);

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `do${domain}`,
      period: 2,
    });

    expect(result.transactionResult.status).toBe('success');
  });

  it('should be able to edit a domain resolver', async () => {
    const domain = randomName(1);

    const newAddress = fakeWallet.address.toB256();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `do${domain}`,
      period: 1,
    });

    const newResolver = await editResolver({
      account: wallet,
      resolver: newAddress,
      domain: `do${domain}`,
    });

    expect(newResolver?.transactionResult.status).toBe('success');
  });

  it('should not be able to edit a domain resolver of a domain not registered', async () => {
    const domain = randomName(1);

    const newAddress = fakeWallet.address.toB256();

    try {
      await editResolver({
        account: wallet,
        resolver: newAddress,
        domain: `do${domain}`,
      });
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'InvalidDomain');
    }
  });

  it('should not be able to edit a domain that is not the owner', async () => {
    const domain = randomName();

    const newAddress = fakeWallet.address.toB256();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain,
      period: 1,
    });
    try {
      const fakeWallet = await createFakeWallet(provider, wallet, '100');

      await editResolver({
        account: fakeWallet,
        resolver: newAddress,
        domain,
      });
    } catch (error) {
      console.log(error);
      expectRequireRevertError(error);
      expectContainLogError(error, 'NotOwner');
    }
  });
});
