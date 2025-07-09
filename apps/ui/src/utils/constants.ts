import { contractsId } from '@bako-id/contracts';

export const blocklistMetadataKeys = ['name', 'image', 'description', 'uri'];

export enum MarketplaceQueryKeys {
  ASSETS = 'assets',
  ASSET = 'asset',
  ORDERS = 'orders',
  ORDER = 'order',
  ALL_ORDERS = 'allOrders',
  ALL_COLLECTIONS = 'allCollections',
  COLLECTION = 'collection',
  COLLECTION_ORDERS = 'collectionOrders',
}

export enum BakoIDQueryKeys {
  NAME = 'name',
  NFTS = 'nfts',
  NFTS_METADATA = 'nfts_metadata',
}

export const ETH_ID =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';
export const FUEL_ASSET_ID =
  '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b';

export const ORDERS_ASSETS_METADATA_STORAGE_KEY = '@bako-id/orders-assets';
export const COLLECTION_ASSETS_METADATA_STORAGE_KEY =
  '@bako-id/collection-assets';

export const BAKO_CONTRACTS_IDS = [
  contractsId.mainnet.nft,
  contractsId.testnet.nft,
  contractsId.local.nft,
];

export const BAKO_SAFE_BKT_CONTRACT_ID = [
  '0x33f6d2bf0762223229bc5b17cee8c1c0090be95dfd3ece5b63e8efb9e456ee21', // MAINNET
  '0x1514bb9a0afa0729f25c40200dd9def4236b15d6bd48c5b9d727a716584d3d23', // TESTNET
];
