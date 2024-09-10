import { Provider, WalletUnlocked } from 'fuels';
import { register, resolver, resolverName } from '../index';
import { createFakeWallet } from '../test';
import {
  InvalidDomainError,
  InvalidHandleError,
  NotFoundBalanceError,
  NotOwnerError,
  SameResolverError,
  randomName,
} from '../utils';
import { editResolver, setPrimaryHandle, simulateHandleCost } from './register';

const { PROVIDER_URL } = process.env;

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;
  let fakeWallet: WalletUnlocked;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);

    wallet = await createFakeWallet(provider, '1.2');
    fakeWallet = await createFakeWallet(provider, '0.1');
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
    }
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
    const wallet = WalletUnlocked.generate({ provider });
    const registerResult = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `do${randomName(1)}`,
      period: 1,
    });

    await expect(registerResult).rejects.toBeInstanceOf(NotFoundBalanceError);
  });

  it('should be able to register domain with 2 years', async () => {
    const domain = randomName();

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `do${domain}`,
      period: 2,
    });

    expect(result.transactionResult.status).toBe('success');
  });

  it('should be able to edit a domain resolver', async () => {
    const domain = randomName();

    const newAddress = fakeWallet.address.toB256();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain,
      period: 1,
    });

    const newResolver = await editResolver({
      account: wallet,
      resolver: newAddress,
      domain,
    });

    const resolverAddress = await resolver(domain, {
      provider,
    });

    expect(resolverAddress).toBe(newAddress);
    expect(newResolver?.transactionResult.status).toBe('success');
  });

  it('should not be able to edit a domain resolver of a domain not registered', async () => {
    const domain = randomName();

    const newAddress = fakeWallet.address.toB256();

    const edit = editResolver({
      account: wallet,
      resolver: newAddress,
      domain,
    });

    await expect(edit).rejects.toBeInstanceOf(InvalidHandleError);
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

    const editFakeWallet = await createFakeWallet(provider, '0.01');

    const edit = editResolver({
      account: editFakeWallet,
      resolver: newAddress,
      domain,
    });

    await expect(edit).rejects.toBeInstanceOf(NotOwnerError);
  });

  it('should not be able to edit a domain resolver with same address', async () => {
    const domain = randomName();

    const newAddress = wallet.address.toB256();

    await register({
      account: wallet,
      resolver: newAddress,
      domain,
      period: 1,
    });

    const edit = editResolver({
      account: wallet,
      resolver: newAddress,
      domain,
    });

    await expect(edit).rejects.toBeInstanceOf(SameResolverError);
  });

  it('should simulate handle cost', async () => {
    const domain = randomName();

    const cost = await simulateHandleCost({
      domain,
      period: 1,
    });

    expect(cost).toBeDefined();
  });

  it('should simulate handle cost with 2 years', async () => {
    const domain = randomName();

    const cost = await simulateHandleCost({
      domain,
      period: 2,
    });

    expect(cost).toBeDefined();
  });

  it('should be able to set primary handle', async () => {
    const domain = randomName();
    const secondaryDomain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain,
      period: 1,
    });

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: secondaryDomain,
      period: 1,
    });

    const setPrimary = await setPrimaryHandle({
      domain: secondaryDomain,
      account: wallet,
    });

    const handle = await resolverName(wallet.address.toB256());

    expect(setPrimary.transactionResult.status).toBe('success');
    expect(handle).toBe(secondaryDomain);
  });

  it('should not be able to set primary handle with invalid domain', async () => {
    const setPrimary = setPrimaryHandle({
      domain: 'invalid',
      account: wallet,
    });

    await expect(setPrimary).rejects.toBeInstanceOf(InvalidHandleError);
  });

  it('should not be able to set primary handle with domain not registered', async () => {
    const setPrimary = setPrimaryHandle({
      domain: randomName(),
      account: wallet,
    });

    await expect(setPrimary).rejects.toBeInstanceOf(InvalidHandleError);
  });

  it('should not be able to set primary handle of a domain that is not the owner', async () => {
    const domain = randomName();
    const secondaryDomain = randomName();

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain,
      period: 1,
    });

    await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: secondaryDomain,
      period: 1,
    });

    const setPrimary = setPrimaryHandle({
      domain: secondaryDomain,
      account: fakeWallet,
    });

    await expect(setPrimary).rejects.toBeInstanceOf(NotOwnerError);
  });
});
