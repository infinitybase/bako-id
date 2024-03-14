import { getRegistryContract } from './setup';
import { Account, BaseAssetId, Provider } from 'fuels';
import { domainPrices, getTxParams, InvalidDomainError, isValidDomain, NotFoundBalanceError } from './utils';
import { envrionment } from './config';
import { Domain, ResolverReturn } from './types';

type RegisterDomainParams = {
  domain: string,
  resolver: string,
  account: Account,
}

type ResolveDomainParams = {
  domain: string,
  account?: Account,
  provider?: Provider,
  providerURL?: string,
}

const register = async (params: RegisterDomainParams) => {
  const { account, domain, resolver } = params;

  const isValid = isValidDomain(domain);

  if (!isValid) {
    throw new InvalidDomainError();
  }

  const { registry } = await getRegistryContract({
    account,
    storageId: envrionment.STORAGE_CONTRACT_ID!
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);
  const amount = domainPrices(domain);
  const accountBalance = await account.getBalance();
  const hasBalance = accountBalance.gte(amount);

  if (!hasBalance) {
    throw new NotFoundBalanceError();
  }

  const { transactionResult, transactionResponse, gasUsed, transactionId } = await registry
    .functions
    .register(domain, resolver)
    .callParams({
      forward: { amount, assetId: BaseAssetId }
    })
    .txParams(txParams)
    .call();

  return {
    gasUsed,
    transactionId,
    transactionResult,
    transactionResponse
  };
};

const resolver = async (params: ResolveDomainParams): ResolverReturn => {
  const { domain, providerURL } = params;

  const isValid = isValidDomain(domain);

  if (!isValid) {
    throw new InvalidDomainError();
  }

  let provider;
  if (params.account) {
    provider = params.account.provider;
  } else if (providerURL) {
    provider = await Provider.create(providerURL);
  } else if (params.provider) {
    provider = params.provider;
  } else {
    throw new Error('Provider or account is required.');
  }

  const txParams = getTxParams(provider);

  const { registry } = await getRegistryContract({
    provider,
    storageId: envrionment.STORAGE_CONTRACT_ID!
  });

  const { value } = await registry.functions
    .resolver(domain)
    .txParams(txParams)
    .dryRun();

  return value ? {
    name: domain,
    owner: value.owner,
    resolver: value.resolver,
  } : null;
};

export { register, resolver, ResolverReturn, Domain };
