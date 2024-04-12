import { type Account, Address, Provider } from 'fuels';
import type { ResolverReturn } from '../types';
import { assertValidDomain, getTxParams } from '../utils';
import { getRegistryContract } from '../setup';
import { config } from '../config';

type ResolverProviderParams = {
  account?: Account;
  provider?: Provider;
  providerURL?: string;
};

/**
 * Returns a provider based on the provided parameters.
 *
 * @param {ResolverProviderParams} params - The parameters for retrieving the provider.
 * @property {string} params.account - An optional account object.
 * @property {string} params.providerURL - An optional URL for creating a provider.
 * @property {string} params.provider - An optional provider object.
 *
 * @throws {Error} If provider or account is required.
 *
 * @returns {Promise<Provider>} The retrieved provider.
 */
async function getProviderFromParams(
  params?: ResolverProviderParams,
): Promise<Provider> {
  if (!params) {
    return Provider.create(config.PROVIDER_DEPLOYED!);
  }

  let provider: Provider | null = null;

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
 * Resolves the domain using the specified domain and parameters.
 *
 * @param {string} domain - The domain to be resolved.
 * @param {ResolveDomainParams} params - The parameters for resolving the domain.
 * @returns {Promise<ResolverReturn>} The resolved domain information or null if it is not found.
 */
export async function resolver(
  domain: string,
  params?: ResolverProviderParams,
): ResolverReturn {
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
 * @param {string | Address} resolver - The resolver address to resolve.
 * @param {ResolverProviderParams} [params] - The parameters for the reverse resolver.
 * @returns {Promise<string | null>} - The resolved reverse name, or null if not found.
 */
export async function reverseResolver(
  resolver: Address | string,
  params?: ResolverProviderParams,
): Promise<string | null> {
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

  return value ? value : null;
}
