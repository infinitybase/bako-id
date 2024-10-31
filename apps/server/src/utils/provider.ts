import { config } from '@bako-id/sdk';
import { type Account, Provider } from 'fuels';

export type ProviderParams = {
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
export async function getProviderFromParams(
  params?: ProviderParams,
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
