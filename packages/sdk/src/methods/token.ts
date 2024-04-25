import { BaseAssetId, sha256 } from 'fuels';
import { config } from '../config';
import { getRegistryContract } from '../setup';
import {
  type ProviderParams,
  assertValidDomain,
  domainToBytes,
  getProviderFromParams,
} from '../utils';

type TokenInfo = {
  name: string;
  image: string;
  symbol: string;
  subId: string;
  contractId: string;
};

/**
 * Retrieves token data.
 *
 * @param {string} handle - The handle of the token.
 * @param {ProviderParams} params - The provider parameters.
 *
 * @return {Promise<TokenInfo|undefined>} - The token information.
 */
export async function tokenInfo(handle: string, params?: ProviderParams) {
  const handleName = assertValidDomain(handle);
  const provider = await getProviderFromParams(params);

  const { registry } = await getRegistryContract({
    storageId: config.STORAGE_CONTRACT_ID!,
    provider,
  });

  const { value: tokenImage } = await registry.functions
    .image_url(handleName)
    .get();

  if (!tokenImage) {
    return undefined;
  }

  const { value: tokenName } = await registry.functions
    .name({ value: BaseAssetId })
    .get();
  const { value: tokenSymbol } = await registry.functions
    .symbol({ value: BaseAssetId })
    .get();

  return {
    name: tokenName,
    image: tokenImage,
    symbol: tokenSymbol,
    subId: sha256(domainToBytes(handleName)),
    contractId: config.REGISTRY_CONTRACT_ID,
  } as TokenInfo;
}
