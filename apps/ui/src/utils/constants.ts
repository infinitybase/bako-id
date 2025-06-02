import { contractsId } from '@bako-id/contracts';

export const blocklistMetadataKeys = ['name', 'image', 'description', 'uri'];

export enum MarketplaceQueryKeys {
  ASSETS = 'assets',
  ASSET = 'asset',
  ORDERS = 'orders',
  ORDER = 'order',
  ALL_ORDERS = 'allOrders',
}

export enum BakoIDQueryKeys {
  NAME = 'name',
  NFTS = 'nfts',
  NFTS_METADATA = 'nfts_metadata',
}

export const ETH_ID =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

export const ORDERS_ASSETS_METADATA_STORAGE_KEY = '@bako-id/orders-assets';
export const COLLECTION_ASSETS_METADATA_STORAGE_KEY =
  '@bako-id/collection-assets';

export const BAKO_CONTRACTS_IDS = [
  contractsId.mainnet.nft,
  contractsId.testnet.nft,
  contractsId.local.nft,
];
