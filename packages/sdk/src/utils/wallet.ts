import {
  type BN,
  BaseAssetId,
  type CoinQuantity,
  type Provider,
  type TransactionRequest,
  WalletLocked,
} from 'fuels';

export class FakeAccount extends WalletLocked {
  constructor(provider: Provider) {
    super(BaseAssetId, provider);
  }

  async fund<T extends TransactionRequest>(
    request: T,
    coinQuantities: CoinQuantity[],
    _fee: BN
  ) {
    await request.fundWithFakeUtxos(coinQuantities);
  }
}

export const getFakeAccount = (provider: Provider) => {
  return new FakeAccount(provider);
};
