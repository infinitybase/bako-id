import { Address, type Provider } from 'fuels';
import { config } from '../config';
import { ResolverContract } from '../types';
import type { Option } from '../types/sway/contracts/common';
import {
  type ProviderParams,
  assertValidDomain,
  getProviderFromParams,
} from '../utils';

const getContract = (account: Provider) =>
  new ResolverContract(config.RESOLVER_CONTRACT_ID, account);

/**
 * Resolves the domain using the specified domain and parameters.
 *
 * @param {string} domain - The domain to be resolved.
 * @param {ResolveDomainParams} params - The parameters for resolving the domain.
 * @returns {Option<String>} The resolved domain information or null if it is not found.
 */
export async function resolver(
  domain: string,
  params?: ProviderParams
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
  params?: ProviderParams
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
  params?: ProviderParams
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
