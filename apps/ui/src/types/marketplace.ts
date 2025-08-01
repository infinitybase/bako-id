import type { CollectionConfig } from '@/modules/marketplace/utils/mint';
import type { FuelAsset, Metadata } from '@/services/fuel-assets';

export interface Asset {
  id: string;
  metadata: FuelAsset | null;
  fees: [string, string];
  __typename: 'Asset';
}

export interface OrderFromFuel {
  __typename: 'Order';
  id: string;
  asset: (FuelAsset & { id: string }) | null;
  amount: string;
  seller: string;
  itemPrice: string;
  itemAsset: string;
  status: string;
  nft: {
    id: string;
    metadata: Record<string, string> & Metadata;
    contractId?: string;
    edition?: string;
    name?: string | null;
    image?: string;
    description?: string;
    fuelMetadata?: FuelAsset | null;
  };
}

export interface Order {
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
    raw: string
  };
  seller: string;
  status: number;
  updatedAt: string;
  processing?: boolean;
}

export interface OrderWithMedatada {
  id: string;
  status: number;
  collection: {
    address: string;
    name: string;
  };
  seller: string;
  buyer: string;
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

type Config = CollectionConfig & {
  avatar: string;
  banner: string;
  description: string;
  social: {
    x?: string;
    site?: string;
    discord?: string;
  };
};

export interface Collection {
  config: Config;
  isMintable: boolean;
  createdAt: string;
  description: string | null;
  id: string;
  latestSalesNFTs: [{ image: string; id: string }];
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

export type MarketplacePaginatedResponseUserOrders<T> = {
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
    totalOrdersUsdPrice: number;
    notListedTotalUsdPrice: number;
  };
};
