import { type Provider, Wallet, type WalletUnlocked, bn } from 'fuels';

export async function createFakeWallet(
  provider: Provider,
  mainWallet: WalletUnlocked,
  amount = '0.000000001'
) {
  const fakeWallet = Wallet.generate({ provider });
  await mainWallet
    .transfer(fakeWallet.address, bn.parseUnits(amount))
    .then((a) => a.waitForResult());
  return fakeWallet;
}
