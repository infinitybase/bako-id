import { Registry, getContractId } from '@bako-id/contracts';
import {
  type Account,
  type Provider,
  TransactionStatus,
  getMintedAssetId,
  sha256,
  toUtf8Bytes,
} from 'fuels';
import {
  type Enum,
  type Identity,
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
} from '../utils';
import { OffChainSync } from './offChainSync';

export type RegisterPayload = {
  domain: string;
  period: number;
  resolver: string;
};

export type SimulatePayload = {
  domain: string;
  period: number;
};

async function checkAccountBalance(
  account: Account,
  domain: string,
  period?: number,
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

  static create(account: Account) {
    const contractId = getContractId(account.provider.url, 'registry');
    return new RegistryContract(contractId, account);
  }

  async register(params: RegisterPayload) {
    const { domain, period, resolver } = params;

    const domainName = assertValidDomain(domain);
    const resolverInput = await this.getIdentity(resolver);
    const amount = await checkAccountBalance(this.account, domainName, period);
    const registerCall = await this.contract.functions
      .register(domainName, resolverInput, period)
      .callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      })
      .call();

    const { transactionResult, transactionResponse, gasUsed, transactionId } =
      await registerCall.waitForResult();

    if (transactionResult.status === TransactionStatus.success) {
      await OffChainSync.setNew(params, this.provider, transactionId);
    }

    return {
      gasUsed,
      transactionId,
      transactionResult,
      transactionResponse,
      assetId: getMintedAssetId(
        this.contract.id.toB256(),
        sha256(toUtf8Bytes(domainName)),
      ),
    };
  }

  async simulate(params: SimulatePayload) {
    const { domain, period } = params;

    const domainName = assertValidDomain(domain);
    const amount = domainPrices(domain, period);
    const resolverInput = await this.getIdentity(this.account.address.toB256());

    const transactionRequest = await this.contract.functions
      .register(domainName, resolverInput, period)
      .callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      })
      .getTransactionRequest();

    const { gasUsed, minFee } =
      await this.account.getTransactionCost(transactionRequest);

    return {
      fee: gasUsed.add(minFee),
      price: amount,
      transactionRequest,
    };
  }

  async token(domain: string) {
    const domainName = assertValidDomain(domain);
    const subId = sha256(toUtf8Bytes(domainName));
    const assetId = getMintedAssetId(this.contract.id.toB256(), subId);

    const { value: image } = await this.contract.functions
      .metadata({ bits: assetId }, 'image:png')
      .get();

    return {
      subId,
      assetId,
      image: image?.String,
      contractId: this.contract.id.toB256(),
    };
  }

  private async getIdentity(resolver: string) {
    let resolverInput: Enum<Identity>;
    const type = await this.provider.getAddressType(resolver);
    if (type === 'Contract') {
      resolverInput = { ContractId: { bits: resolver } };
    } else if (type === 'Account') {
      resolverInput = { Address: { bits: resolver } };
    } else {
      throw new Error('Invalid resolver type');
    }
    return resolverInput;
  }
}
