import { contractsId } from '@bako-id/contracts';

export enum MarketplaceQueryKeys {
  ORDERS = 'orders',
  USER_ORDERS = 'user-orders',
  ORDER = 'order',
}

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
