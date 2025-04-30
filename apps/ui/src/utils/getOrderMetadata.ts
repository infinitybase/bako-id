import { type FuelAsset, FuelAssetService } from '@/services/fuel-assets';
import type { Order } from '@/types/marketplace';
import { assignIn, concat, merge, uniqBy } from 'lodash';
import { ASSETS_METADATA_STORAGE_KEY } from './constants';
import { formatMetadataFromIpfs, parseURI } from './formatter';
import { getLocalStorage, setLocalStorage } from './localStorage';

export type OrderResponse = Omit<Order, 'nft' | 'asset'> & {
  asset: string;
};

type AssetMetadata = (FuelAsset & { id: string }) | null;

type CachedMetadata = Record<string, AssetMetadata>;

export const getAssetMetadata = async (
  assetId: string,
  chainId?: number | null
) => {
  const metadataByStorage = getLocalStorage<CachedMetadata>(
    ASSETS_METADATA_STORAGE_KEY
  );

  const metadataByCache = metadataByStorage?.[assetId] || null;

  if (metadataByCache) {
    console.log('Cache hit', assetId);
    return metadataByCache;
  }

  const assetMetadata = await FuelAssetService.byAssetId({
    assetId,
    chainId: chainId!,
  });

  return assetMetadata;
};

export const getOrderMetadata = async (
  order: OrderResponse,
  chainId?: number | null
): Promise<Order> => {
  const assetMetadata = await getAssetMetadata(order.asset, chainId);
  const fuelMetadata = await getAssetMetadata(order.itemAsset, chainId);
  const ipfsMetadata: Record<string, string> = {};

  if (fuelMetadata?.uri?.endsWith('.json')) {
    const json: Record<string, string> = await fetch(fuelMetadata.uri)
      .then(async (res) => await res.json())
      .catch(() => ({}));
    const data = formatMetadataFromIpfs(json);
    assignIn(ipfsMetadata, data);
  }

  const metadata = merge(ipfsMetadata, fuelMetadata?.metadata ?? {});

  return {
    ...order,
    asset: assetMetadata
      ? {
          ...assetMetadata,
          id: order.asset,
        }
      : null,
    nft: {
      metadata,
      fuelMetadata,
      contractId: fuelMetadata?.contractId,
      id: order.itemAsset,
      edition: ipfsMetadata?.edition ? `#${ipfsMetadata.edition}` : undefined,
      name: fuelMetadata?.name,
      image: fuelMetadata?.metadata?.image
        ? parseURI(fuelMetadata?.metadata?.image)
        : undefined,
      description: ipfsMetadata?.description,
    },
  };
};

export const saveMetadataToLocalStorage = (orders: Order[]) => {
  const uniqueAssets = uniqBy(
    orders
      .filter((order) => order.asset)
      .map((order) => ({
        ...order.asset,
        id: order.asset?.id as string,
      })),
    'id'
  );
  const nftAssets = orders
    .filter((order) => order.nft.fuelMetadata)
    .map((order) => ({
      ...order.nft.fuelMetadata,
      id: order.nft.id,
    }));

  const metadata = concat(uniqueAssets, nftAssets);
  const metadataByStorage =
    getLocalStorage<CachedMetadata>(ASSETS_METADATA_STORAGE_KEY) || {};

  const newMetadata = metadata.reduce((acc, asset) => {
    const { id, ...rest } = asset;
    return Object.assign(acc, {
      [id]: {
        ...rest,
        id,
      },
    });
  }, {} as CachedMetadata);

  setLocalStorage(
    ASSETS_METADATA_STORAGE_KEY,
    merge(metadataByStorage, newMetadata)
  );
};
