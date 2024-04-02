import { Account, Address, Provider } from 'fuels';
import { ResolverReturn } from '../types';
import { assertValidDomain, getTxParams } from '../utils';
import { getRegistryContract } from '../setup';
import { config } from '../config';

type ResolveDomainParams = GetProviderParams & {
  domain: string;
};

type ReverseResolverDomainParams = GetProviderParams & {
  resolver: Address | string;
};

type GetProviderParams = {
  account?: Account;
  provider?: Provider;
  providerURL?: string;
};

/**
 * Returns a provider based on the provided parameters.
 *
 * @param {GetProviderParams} params - The parameters for retrieving the provider.
 * @property {string} params.account - An optional account object.
 * @property {string} params.providerURL - An optional URL for creating a provider.
 * @property {string} params.provider - An optional provider object.
 *
 * @throws {Error} If provider or account is required.
 *
 * @returns {Promise<Provider>} The retrieved provider.
 */
async function getProviderFromParams(params: GetProviderParams) {
  let provider;

  if (params.account) {
    provider = params.account.provider;
  } else if (params.providerURL) {
    provider = await Provider.create(params.providerURL);
  } else if (params.provider) {
    provider = params.provider;
  }

  if (!provider) throw new Error('Provider or account is required.');

  return provider;
}

/**
 * Resolves domain using the given parameters.
 *
 * @param {ResolveDomainParams} params - The parameters for resolving the domain.
 * @param {string} params.domain - The domain to resolve.
 *
 * @returns {Promise<ResolverReturn>} - A promise that resolves to the result of resolving the domain.
 */
export async function resolver(params: ResolveDomainParams): ResolverReturn {
  const { domain } = params;

  const domainName = assertValidDomain(domain);

  const provider = await getProviderFromParams(params);
  const txParams = getTxParams(provider);

  const { registry } = await getRegistryContract({
    provider,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const { value } = await registry.functions
    .resolver(domainName)
    .txParams(txParams)
    .dryRun();

  return value
    ? {
        name: domainName,
        owner: value.owner,
        resolver: value.resolver,
      }
    : null;
}

/**
 * Resolves the reverse name associated with a given resolver address.
 *
 * @param {ReverseResolverDomainParams} params - The parameters for the reverse resolver.
 * @param {string | Address} params.resolver - The resolver address to resolve.
 * @returns {Promise<string | null>} - The resolved reverse name, or null if not found.
 */
export async function reverseResolver(params: ReverseResolverDomainParams) {
  const { resolver } = params;

  const resolverAddress =
    typeof resolver === 'string'
      ? Address.fromAddressOrString(resolver)
      : resolver;

  const provider = await getProviderFromParams(params);
  const txParams = getTxParams(provider);

  const { registry } = await getRegistryContract({
    provider,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const { value } = await registry.functions
    .reverse_name(resolverAddress.toB256())
    .txParams(txParams)
    .dryRun();

  return !!value ? value : null;
}
