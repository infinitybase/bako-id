import { type Provider, Wallet, bn } from 'fuels';

const { TEST_WALLET } = process.env;

export async function createFakeWallet(provider: Provider, amount = '0.1') {
  const mainWallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);
  const fakeWallet = Wallet.generate({ provider });
  await mainWallet
    .transfer(fakeWallet.address, bn.parseUnits(amount))
    .then((a) => a.waitForResult());

  return fakeWallet;
}
