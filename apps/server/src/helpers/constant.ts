import { contractsId } from '@bako-id/contracts';

export const blacklistMetadataKeys = ['name', 'image', 'description', 'uri'];

export enum MarketplaceQueryKeys {
  ORDERS = 'orders',
}

export const ORDERS_ASSETS_METADATA_STORAGE_KEY = '@bako-id/orders-assets';
export const COLLECTION_ASSETS_METADATA_STORAGE_KEY =
  '@bako-id/collection-assets';

export const BAKO_CONTRACTS_IDS = [
  contractsId.mainnet.nft,
  contractsId.testnet.nft,
  contractsId.local.nft,
];
