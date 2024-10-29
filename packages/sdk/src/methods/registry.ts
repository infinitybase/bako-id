import { Registry } from '@bako-id/contracts';
import {
  type Account,
  type Provider,
  getMintedAssetId,
  sha256,
  toUtf8Bytes,
} from 'fuels';
import {
  type Enum,
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
} from '../utils';

type Identity = {
  ContractId: { bits: string };
  Address: { bits: string };
};

export type RegisterPayload = {
  domain: string;
  period: number;
  resolver: string;
};

async function checkAccountBalance(
  account: Account,
  domain: string,
  period?: number
) {
  const amount = domainPrices(domain, period);
  const accountBalance = await account.getBalance();

  const hasBalance = accountBalance.gte(amount);
  if (!hasBalance) {
    throw new NotFoundBalanceError();
  }
  return amount;
}

export class RegistryContract {
  private contract: Registry;
  private account: Account;
  private provider: Provider;

  constructor(id: string, account: Account) {
    this.contract = new Registry(id, account);
    this.account = account;
    this.provider = account.provider;
  }

  async register(params: RegisterPayload) {
    const { domain, period, resolver } = params;

    const domainName = assertValidDomain(domain);

    let resolverInput: Enum<Identity>;
    const type = await this.provider.getAddressType(resolver);
    if (type === 'Contract') {
      resolverInput = { ContractId: { bits: resolver } };
    } else if (type === 'Account') {
      resolverInput = { Address: { bits: resolver } };
    } else {
      throw new Error('Invalid resolver type');
    }

    const amount = await checkAccountBalance(this.account, domainName, period);
    const registerCall = await this.contract.functions
      .register(domain, resolverInput, period)
      .callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      })
      .call();

    const { transactionResult, transactionResponse, gasUsed, transactionId } =
      await registerCall.waitForResult();

    return {
      gasUsed,
      transactionId,
      transactionResult,
      transactionResponse,
      assetId: getMintedAssetId(
        this.contract.id.toB256(),
        sha256(toUtf8Bytes(domainName))
      ),
    };
  }
}
