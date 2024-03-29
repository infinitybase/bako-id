import { BaseAssetId, bn, Provider, ScriptTransactionRequest, Wallet, WalletUnlocked } from 'fuels';
import { register, resolver } from '../index';
import { InvalidDomainError, NotFoundBalanceError } from '../utils';

const { PROVIDER_URL, TEST_WALLET } = process.env;

function randomName(size = 5) {
  const name = (Math.random() + 2).toString(32).substring(2);
  return `${name}`.slice(0, size);
}

async function createFakeWallet(provider: Provider, mainWallet: WalletUnlocked) {
  const fakeWallet = Wallet.generate({ provider });
  const quantity = {
    assetId: BaseAssetId,
    amount: bn.parseUnits('0.0000001')
  };
  const resourcesToSpend = await mainWallet.getResourcesToSpend([quantity]);
  const { minGasPrice } = provider.getGasConfig();

  const request = new ScriptTransactionRequest({
    gasLimit: 10000,
    gasPrice: minGasPrice,
  });

  request.addResources(resourcesToSpend);
  request.addCoinOutput(fakeWallet.address, quantity.amount, quantity.assetId);
  await mainWallet.sendTransaction(request, { awaitExecution: true });

  return fakeWallet;
}

describe('Test Registry', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;
  let fakeWallet: WalletUnlocked;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(TEST_WALLET, provider);
    fakeWallet = await createFakeWallet(provider, wallet);
  });

  it('should error when register domain with invalid character', async () => {
    const invalidSuffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namenotfuel@'
    });

    await expect(invalidSuffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidPreffix = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: '#namenotfuel'
    });

    await expect(invalidPreffix).rejects.toBeInstanceOf(InvalidDomainError);

    const invalidChars = register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: 'namen otfuel'
    });

    await expect(invalidChars).rejects.toBeInstanceOf(InvalidDomainError);
  });

  it('should register domain with special characters', async () => {
    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: `bako_${randomName(3)}`
    });

    expect(result.transactionResult).toBeDefined();
  });

  it('should register domain and get resolver', async () => {
    const domain = randomName();

    const result = await register({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain
    });

    expect(result.transactionResult.status).toBe('success');

    const resolvedDomain = await resolver({
      domain,
      provider
    });

    expect(resolvedDomain.owner).toBe(wallet.address.toB256());
    expect(resolvedDomain.resolver).toBe(wallet.address.toB256());
  });

  it('should error when register domain without balance', async () => {
    const registerResult = register({
      account: fakeWallet,
      resolver: wallet.address.toB256(),
      domain: `do${randomName(1)}`,
    });

    await expect(registerResult).rejects.toBeInstanceOf(NotFoundBalanceError);
  });
});
