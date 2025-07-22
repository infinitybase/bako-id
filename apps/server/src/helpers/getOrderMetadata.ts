import { FuelAssetService } from '@/services/fuel-assets';
import type { Order } from '@/types/marketplace';
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
