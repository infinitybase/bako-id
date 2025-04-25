import { FuelAssetService } from '@/services/fuel-assets';
import type { Order } from '@/types/marketplace';
import { assignIn, merge } from 'lodash';
import { formatMetadataFromIpfs, parseURI } from './formatter';

export type OrderResponse = Omit<Order, 'nft' | 'asset'> & {
  asset: string;
};

export const getAssetMetadata = async (
  assetId: string,
  chainId?: number | null
) => {
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
