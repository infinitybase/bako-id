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
    const resources = this.generateFakeResources(
      coinQuantities.requiredQuantities
    );
    request.addResources(resources);
    return request;
  }
}

export const getFakeAccount = (provider: Provider) => {
  return new FakeAccount(provider);
};
