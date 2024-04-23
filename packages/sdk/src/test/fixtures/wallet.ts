import {
  BaseAssetId,
  type Provider,
  ScriptTransactionRequest,
  Wallet,
  type WalletUnlocked,
  bn,
} from 'fuels';

export async function createFakeWallet(
  provider: Provider,
  mainWallet: WalletUnlocked,
  amount = '0.000000001'
) {
  const fakeWallet = Wallet.generate({ provider });
  const quantity = {
    assetId: BaseAssetId,
    amount: bn.parseUnits(amount),
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
