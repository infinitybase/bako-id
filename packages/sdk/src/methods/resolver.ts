import { type Account, Address, Provider } from 'fuels';
import { config } from '../config';
import { ResolverContractAbi__factory } from '../types';
import type { Option } from '../types/sway/contracts/common';
import { assertValidDomain } from '../utils';

type ResolverProviderParams = {
  account?: Account;
  provider?: Provider;
  providerURL?: string;
};

const getContract = (account: Provider) =>
  ResolverContractAbi__factory.connect(config.RESOLVER_CONTRACT_ID, account);

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
  params?: ResolverProviderParams
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
 * @returns {Option<String>} The resolved domain information or null if it is not found.
 */
export async function resolver(
  domain: string,
  params?: ResolverProviderParams
): Promise<Option<string>> {
  const domainName = assertValidDomain(domain);
  const provider = await getProviderFromParams(params);
  const resolverContractAbi = getContract(provider);

  const { value } = await resolverContractAbi.functions
    .resolver(domainName)
    .get();

  return value;
}

/**
 * Get owner of domain using the specified domain and parameters.
 *
 * @param {string} domain - The domain to be resolved.
 * @param {ResolveDomainParams} params - The parameters for resolving the domain.
 * @returns {Option<String>} The resolved domain information or null if it is not found.
 */
export async function owner(
  domain: string,
  params?: ResolverProviderParams
): Promise<Option<string>> {
  const domainName = assertValidDomain(domain);
  const provider = await getProviderFromParams(params);
  const resolverContractAbi = getContract(provider);

  const { value } = await resolverContractAbi.functions.owner(domainName).get();

  return value;
}

/**
 * Resolves the reverse name associated with a given resolver address.
 *
 * @param {string | Address} resolver - The resolver address to resolve.
 * @param {ResolverProviderParams} [params] - The parameters for the reverse resolver.
 * @returns {Promise<string | null>} - The resolved reverse name, or null if not found.
 */
export async function resolverName(
  resolver: Address | string,
  params?: ResolverProviderParams
): Promise<string | null> {
  const resolverAddress =
    typeof resolver === 'string'
      ? Address.fromAddressOrString(resolver)
      : resolver;

  const provider = await getProviderFromParams(params);
  const resolverContractAbi = getContract(provider);

  const { value } = await resolverContractAbi.functions
    .name(resolverAddress.toB256())
    .get();

  return value || null;
}
