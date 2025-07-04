import { Manager, Nft, Registry, getContractId } from '@bako-id/contracts';
import {
  type Account,
  DateTime,
  type Provider,
  getMintedAssetId,
  getRandomB256,
  sha256,
  toUtf8Bytes,
  Address,
  type BN,
  type ScriptTransactionRequest,
  type TransactionResult,
  type TransactionResponse,
} from 'fuels';

import {
  type Enum,
  type Identity,
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
  getFakeAccount,
} from '../utils';
import { MetadataKeys } from './types';

export type RegisterPayload = {
  domain: string;
  period: number;
  resolver: string;
};

export type ChangeAddressPayload = {
  domain: string;
  address: string;
};

export type SendNftHandlePayload = {
  domain: string;
  ownerAddress: string;
  newOwnerAddress: string;
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

  constructor(id: string, accountOrProvider: Account | Provider) {
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
  }

  static create(accountOrProvider: Account | Provider) {
    let provider: Provider;

    if ('provider' in accountOrProvider) {
      provider = accountOrProvider.provider;
    } else {
      provider = accountOrProvider;
    }

    const contractId = getContractId(provider.url, 'registry');
    return new RegistryContract(contractId, accountOrProvider);
  }

  async register(params: RegisterPayload): Promise<{
    gasUsed: BN;
    transactionId: string;
    transactionResult: TransactionResult;
    transactionResponse: TransactionResponse;
    assetId: string;
  }> {
    const { domain, period, resolver } = params;

    if (!this.account) {
      throw new Error('Account is required to register a domain');
    }

    const domainName = assertValidDomain(domain);
    const resolverInput = await this.getIdentity(resolver);
    const amount = await checkAccountBalance(this.account, domainName, period);
    const assetId = await this.provider.getBaseAssetId();
    const registerCall = await this.contract.functions
      .register(domainName, resolverInput, period)
      .addContracts([this.managerContract, this.nftContract])
      .callParams({
        forward: { amount, assetId },
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

  async changeOwner(payload: ChangeAddressPayload): Promise<TransactionResult> {
    const { domain, address } = payload;

    if (!this.account) {
      throw new Error('Account is required to change the owner');
    }

    const domainName = assertValidDomain(domain);
    const newOwner = await this.getIdentity(address);

    const subId = sha256(toUtf8Bytes(domainName));
    const assetId = getMintedAssetId(this.nftContract.id.toB256(), subId);
    const balanceNftHandle = await this.account.getBalance(assetId);

    const transactionRequest = await this.contract.functions
      .set_owner(domainName, newOwner)
      .addContracts([this.managerContract])
      .fundWithRequiredCoins();

    const hasNftHandle = balanceNftHandle.gt(0);

    if (hasNftHandle) {
      const resources = await this.account.getResourcesToSpend([
        {
          amount: balanceNftHandle,
          assetId,
        },
      ]);

      transactionRequest.addResources(resources);
      transactionRequest.addCoinOutputs(new Address(address), [
        {
          amount: balanceNftHandle,
          assetId,
        },
      ]);
    }
    
    const transactionResponse =
      await this.account.sendTransaction(transactionRequest);

    return transactionResponse.waitForResult();
  }

  async changeResolver(
    payload: ChangeAddressPayload
  ): Promise<TransactionResult> {
    const { domain, address } = payload;

    if (!this.account) {
      throw new Error('Account is required to change the resolver');
    }

    const domainName = assertValidDomain(domain);
    const newResolver = await this.getIdentity(address);

    const changeResolverCall = await this.contract.functions
      .set_resolver(domainName, newResolver)
      .addContracts([this.managerContract])
      .call();
    const { transactionResult } = await changeResolverCall.waitForResult();

    return transactionResult;
  }

  async simulate(params: SimulatePayload): Promise<{
    fee: BN;
    price: BN;
    transactionRequest: ScriptTransactionRequest;
  }> {
    const { domain, period } = params;

    const account = getFakeAccount(this.provider);
    const contract = new Registry(this.contract.id.toB256(), account);

    const domainName = assertValidDomain(domain);
    const amount = domainPrices(domainName, period);
    const resolverInput = {
      Address: { bits: getRandomB256() },
    };

    const assetId = await this.provider.getBaseAssetId();

    const transactionRequest = await contract.functions
      .register(domainName, resolverInput, period)
      .callParams({
        forward: { amount, assetId },
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

  async simulateTxNftHndler(payload: SendNftHandlePayload): Promise<{
    assetId: string;
    balanceNftHandle: BN;
    transactionRequest: ScriptTransactionRequest;
  }> {
    const { domain, ownerAddress } = payload;

    if (!this.account) {
      throw new Error('Account is required to change the owner');
    }

    const domainName = assertValidDomain(domain);
    const owner = await this.getIdentity(ownerAddress);

    const subId = sha256(toUtf8Bytes(domainName));
    const assetId = getMintedAssetId(this.nftContract.id.toB256(), subId);
    const balanceNftHandle = await this.account.getBalance(assetId);

    const transactionRequest = await this.contract.functions
      .set_owner(domainName, owner)
      .addContracts([this.managerContract])
      .fundWithRequiredCoins();

    return {assetId, balanceNftHandle, transactionRequest};
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

  async setMetadata(
    domain: string,
    metadata: Partial<Record<MetadataKeys, string>>
  ): Promise<TransactionResult> {
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
    return transactionResult;
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
