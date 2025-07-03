import type { FuelAsset } from '@/services/fuel-assets';

export interface Asset {
  id: string;
  metadata: FuelAsset | null;
  fees: [string, string];
  __typename: 'Asset';
}

export interface Orders {
  asset: {
    id: string;
    image: string;
    name: string;
  };
  buyer: string | null;
  createdAt: string;
  id: string;
  price: {
    amount: number;
    assetId: string;
    image: string;
    name: string;
    symbol: string;
    usd: number;
  };
  seller: string;
  status: number;
  updatedAt: string;
}

export interface Order {
  id: string;
  status: number;
  collection: {
    address: string;
    name: string;
  };
  seller: string;
  network: number;
  createdAt: string;
  updatedAt: string;
  price: {
    amount: number;
    raw: string;
    usd: number;
    name: string;
    symbol: string;
    assetId: string;
    image: string;
  };
  asset: {
    id: string;
    name: string;
    image: string;
    subId: string;
    metadata: {
      name: string;
      image: string;
      compiler: string;
      metadata: string;
      attributes: Array<{
        value: string;
        trait_type: string;
      }>;
      description: string;
      external_url: string;
    };
  };
}

export interface Nft {
  metadata: Record<string, string>;
  contractId?: string;
  id: string;
  edition?: string;
  name?: string | null;
  image?: string;
  description?: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Collection {
  config: {
    avatar: string;
    background: string;
  };
  createdAt: string;
  description: string | null;
  id: string;
  latestSalesNFTs: [];
  name: string;
  network: number;
  updatedAt: string;
  metrics: {
    sales: string;
    floorPrice: number;
    volume: number;
  };
}

export type MarketplacePaginatedResponse<T> = {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};
