import {
  type EstimatedTxParams,
  type Provider,
  type TransactionRequest,
  WalletLocked,
  ZeroBytes32,
} from 'fuels';

export class FakeAccount extends WalletLocked {
  constructor(provider: Provider) {
    super(ZeroBytes32, provider);
  }

  async fund<T extends TransactionRequest>(
    request: T,
    coinQuantities: EstimatedTxParams
  ) {
    request.fundWithFakeUtxos(
      coinQuantities.requiredQuantities,
      this.provider.getBaseAssetId()
    );

    return request;
  }
}

export const getFakeAccount = (provider: Provider) => {
  return new FakeAccount(provider);
};
