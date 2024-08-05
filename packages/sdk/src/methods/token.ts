import { getMintedAssetId, sha256 } from 'fuels';
import { config } from '../config';
import { getRegistryContract } from '../setup';
import {
  assertValidDomain,
  domainToBytes,
  getProviderFromParams,
  type ProviderParams,
} from '../utils';

type TokenInfo = {
  assetId: string;
  subId: string;
  contractId: string;
};

/**
 * Retrieves token data.
 *
 * @param {string} handle - The handle of the token.
 * @param {ProviderParams} params - The provider parameters.
 * @example
 * const token = await tokenInfo('domain');
 * console.log(token.image); // https://assets.bako.id/domain
 *
 * @return {Promise<TokenInfo|undefined>} - The token information.
 */
export async function tokenInfo(handle: string, params?: ProviderParams) {
  const handleName = assertValidDomain(handle);
  const provider = await getProviderFromParams(params);

  const subId = sha256(domainToBytes(handle));
  const assetId = getMintedAssetId(config.REGISTRY_CONTRACT_ID, subId);

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

  registry.functions.metadata({ bits: assetId }, 'image:png');

  return {
    assetId,
    subId: sha256(domainToBytes(handleName)),
    contractId: config.REGISTRY_CONTRACT_ID,
  } as TokenInfo;
}
