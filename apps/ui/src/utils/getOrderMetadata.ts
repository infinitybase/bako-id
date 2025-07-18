import { FuelAssetService, type FuelAsset } from '@/services/fuel-assets';
import { ORDERS_ASSETS_METADATA_STORAGE_KEY } from './constants';
import { getLocalStorage } from './localStorage';
import type { OrderFromFuel } from '@/types/marketplace';

export type OrderResponse = Omit<
  OrderFromFuel,
  'nft' | 'asset' | 'sellerDomain'
> & {
  asset: string;
};

export type AssetMetadata =
  | (FuelAsset & { id: string; ipfs?: Record<string, string> })
  | null;

type CachedMetadata = Record<string, AssetMetadata>;

export const getAssetMetadata = async (
  assetId: string,
  chainId?: number | null
): Promise<AssetMetadata> => {
  const metadataByStorage = getLocalStorage<CachedMetadata>(
    ORDERS_ASSETS_METADATA_STORAGE_KEY
  );

  const metadataByCache = metadataByStorage?.[assetId] || null;

  if (metadataByCache) {
    return metadataByCache;
  }

  const assetMetadata = await FuelAssetService.byAssetId({
    assetId,
    chainId: chainId!,
  });

  return assetMetadata ? { ...assetMetadata, id: assetId } : null;
};
