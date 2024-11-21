import { Manager, Nft, Registry, getContractId } from '@bako-id/contracts';
import {
  Account,
  DateTime,
  type Provider,
  TransactionStatus,
  getMintedAssetId,
  getRandomB256,
  sha256,
  toUtf8Bytes,
} from 'fuels';

import {
  type Enum,
  type Identity,
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
  getFakeAccount,
} from '../utils';
import type { BakoIDClient } from './client';
import { MetadataKeys } from './types';

export type RegisterPayload = {
  domain: string;
  period: number;
  resolver: string;
};

export type SimulatePayload = {
  domain: string;
  period: number;
};

const formatTAI64toDate = (value: string) => {
  const date = DateTime.fromTai64(value);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
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
  private nftContract: Nft;
  private managerContract: Manager;
  private account: Account | undefined;
  private provider: Provider;
  private bakoIDClient: BakoIDClient;

  constructor(
    id: string,
    accountOrProvider: Account | Provider,
    bakoIDClient: BakoIDClient
  ) {
    if ('address' in accountOrProvider && !!accountOrProvider.address) {
      this.account = accountOrProvider;
      this.provider = accountOrProvider.provider;
    } else {
      this.provider = accountOrProvider as Provider;
    }

    this.contract = new Registry(id, accountOrProvider);
    this.nftContract = new Nft(
      getContractId(this.provider.url, 'nft'),
      accountOrProvider
    );
    this.managerContract = new Manager(
      getContractId(this.provider.url, 'manager'),
      accountOrProvider
    );
    this.bakoIDClient = bakoIDClient;
  }

  static create(
    accountOrProvider: Account | Provider,
    bakoIDClient: BakoIDClient
  ) {
    let provider: Provider;

    if (accountOrProvider instanceof Account) {
      provider = accountOrProvider.provider;
    } else {
      provider = accountOrProvider;
    }

    const contractId = getContractId(provider.url, 'registry');
    return new RegistryContract(contractId, accountOrProvider, bakoIDClient);
  }

  async register(params: RegisterPayload) {
    const { domain, period, resolver } = params;

    if (!this.account) {
      throw new Error('Account is required to register a domain');
    }

    const domainName = assertValidDomain(domain);
    const resolverInput = await this.getIdentity(resolver);
    const amount = await checkAccountBalance(this.account, domainName, period);
    const registerCall = await this.contract.functions
      .register(domainName, resolverInput, period)
      .addContracts([this.managerContract, this.nftContract])
      .callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      })
      .call();

    const { transactionResult, transactionResponse, gasUsed, transactionId } =
      await registerCall.waitForResult();

    if (transactionResult.status === TransactionStatus.success) {
      await this.bakoIDClient.register({
        period,
        resolver,
        transactionId,
        domain: domainName,
        owner: this.account.address.toB256(),
      });
    }

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

  async simulate(params: SimulatePayload) {
    const { domain, period } = params;

    const account = getFakeAccount(this.provider);
    const contract = new Registry(this.contract.id.toB256(), account);

    const domainName = assertValidDomain(domain);
    const amount = domainPrices(domainName, period);
    const resolverInput = {
      Address: { bits: getRandomB256() },
    };

    const transactionRequest = await contract.functions
      .register(domainName, resolverInput, period)
      .callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      })
      .getTransactionRequest();

    const { gasUsed, minFee } =
      await account.getTransactionCost(transactionRequest);

    return {
      fee: gasUsed.add(minFee),
      price: amount,
      transactionRequest,
    };
  }

  async token(domain: string) {
    const domainName = assertValidDomain(domain);
    const subId = sha256(toUtf8Bytes(domainName));
    const assetId = getMintedAssetId(this.nftContract.id.toB256(), subId);
    const nftId = getContractId(this.provider.url, 'nft');
    const nftContract = new Nft(nftId, this.provider);

    const { value: image } = await nftContract.functions
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

  async setMetadata(
    domain: string,
    metadata: Partial<Record<MetadataKeys, string>>
  ) {
    if (!this.account) {
      throw new Error('Account is required to setMetadata');
    }
    const domainName = assertValidDomain(domain);
    const _domain = await this.managerContract.functions
      .get_record(domainName)
      .get();
    if (!_domain.value) {
      throw new Error('Domain not found');
    }

    const multiCall = await this.contract
      .multiCall(
        Object.entries(metadata).map(([key, value]) =>
          this.contract.functions
            .set_metadata_info(domainName, key, {
              String: value,
            })
            .addContracts([this.managerContract, this.nftContract])
        )
      )
      .call();
    const { transactionResult } = await multiCall.waitForResult();
    return transactionResult.status === TransactionStatus.success;
  }

  async getMetadata(domain: string) {
    const domainName = assertValidDomain(domain);
    const _domain = await this.managerContract.functions
      .get_record(domainName)
      .get();
    if (!_domain.value) {
      throw new Error('Domain not found');
    }

    // get the minted asset id
    const mintedAssetId = {
      bits: getMintedAssetId(
        this.nftContract.id.toB256(),
        sha256(toUtf8Bytes(domain))
      ),
    };

    const result = await this.contract
      .multiCall(
        Object.entries(MetadataKeys).map(([_, value]) =>
          this.nftContract.functions.metadata(mintedAssetId, value)
        )
      )
      .get();

    return Object.values(MetadataKeys).reduce(
      (acc, key, index) => {
        const entry = result.value[index];
        if (entry !== undefined) {
          acc[key] = entry.String;
        }
        return acc;
      },
      {} as Record<MetadataKeys, string | undefined>
    );
  }

  async getDates(domain: string) {
    const domainName = assertValidDomain(domain);
    const _domain = await this.managerContract.functions
      .get_record(domainName)
      .get();
    if (!_domain.value) {
      throw new Error('Domain not found');
    }

    const {
      value: [ttl, timestamp],
    } = await this.contract
      .multiCall([
        this.contract.functions.ttl(domainName),
        this.contract.functions.timestamp(domainName),
      ])
      .get();

    return {
      ttl: formatTAI64toDate(ttl.toString()),
      timestamp: formatTAI64toDate(timestamp.toString()),
    };
  }
}
