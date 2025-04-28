import { type FuelAsset, FuelAssetService } from '@/services/fuel-assets';
import type { Order } from '@/types/marketplace';
import type { QueryClient } from '@tanstack/react-query';
import { assignIn, merge } from 'lodash';
import { formatMetadataFromIpfs, parseURI } from './formatter';

export type OrderResponse = Omit<Order, 'nft' | 'asset'> & {
  asset: string;
};

type AssetMetadata = (FuelAsset & { id: string }) | null;

export const getAssetMetadata = async (
  assetId: string,
  queryCLient: QueryClient,
  chainId?: number | null
) => {
  const metadataByCache = queryCLient.getQueryData<AssetMetadata | null>([
    'assetMetadata',
    assetId,
  ]);

  if (metadataByCache) {
    console.log('get metadata from cache', assetId);
    return metadataByCache;
  }

  const assetMetadata = await FuelAssetService.byAssetId({
    assetId,
    chainId: chainId!,
  });

  if (assetMetadata) {
    queryCLient.setQueryData<AssetMetadata | null>(['assetMetadata', assetId], {
      ...assetMetadata,
      id: assetId,
    });
  }

  return assetMetadata;
};

export const getOrderMetadata = async (
  order: OrderResponse,
  queryClient: QueryClient,
  chainId?: number | null
): Promise<Order> => {
  console.log('get metadata', order.id);
  const assetMetadata = await getAssetMetadata(
    order.asset,
    queryClient,
    chainId
  );
  const fuelMetadata = await getAssetMetadata(
    order.itemAsset,
    queryClient,
    chainId
  );
  const ipfsMetadata: Record<string, string> = {};

  if (fuelMetadata?.uri?.endsWith('.json')) {
    const json: Record<string, string> = await fetch(fuelMetadata.uri)
      .then((res) => res.json())
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
      ipfs: ipfsMetadata,
      contractId: fuelMetadata?.contractId,
      id: order.itemAsset,
      edition: ipfsMetadata?.edition ? `#${ipfsMetadata.edition}` : undefined,
      name: fuelMetadata?.name,
      image: parseURI(fuelMetadata?.metadata?.image ?? ''),
      description: ipfsMetadata?.description,
    },
  };
};
