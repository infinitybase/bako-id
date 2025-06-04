import { FuelAssetService } from '@/services/fuel-assets';
import type { Order } from '@/types/marketplace';
import { parseURI } from '@/utils';
import { assignIn, merge } from 'lodash';
import { metadataArrayToObject } from './metadata';

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

export const formatMetadataFromIpfs = (metadata: Record<string, string>) => {
  const metadataEntries = Object.entries(metadata).filter(
    ([key]) => !key.toLowerCase().includes('uri')
  );
  const metadataObject: Record<string, string> = {};
  for (const [key, value] of metadataEntries) {
    if (Array.isArray(value)) {
      const metadataValueRecord = metadataArrayToObject(value, key);
      Object.assign(metadataObject, metadataValueRecord);
      delete metadataObject[key];
      continue;
    }
    if (metadataObject[key] === undefined) {
      const metadataValue = value as string;
      metadataObject[key] = metadataValue as string;
    }
  }
  return metadataObject;
};

export const getOrderMetadata = async (
  order: OrderResponse,
  chainId?: number | null
): Promise<Order> => {
  const assetMetadata = await getAssetMetadata(order.asset, chainId);
  const fuelMetadata = await getAssetMetadata(order.itemAsset, chainId);
  const ipfsMetadata: Record<string, string> = {};

  if (fuelMetadata?.uri) {
    const json: Record<string, string> = await fetch(fuelMetadata.uri)
      .then((res) => res.json())
      .catch(() => ({}));
    assignIn(ipfsMetadata, json);
  }

  const metadata = formatMetadataFromIpfs(
    merge(ipfsMetadata, fuelMetadata?.metadata ?? {})
  );

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
      name: metadata?.name,
      image: metadata?.image ? parseURI(metadata?.image) : undefined,
      description: ipfsMetadata?.description,
    },
  };
};
