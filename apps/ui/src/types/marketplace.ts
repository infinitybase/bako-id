import type { FuelAsset, Metadata } from '@/services/fuel-assets';

export interface Asset {
  id: string;
  metadata: FuelAsset | null;
  fees: [string, string];
  __typename: 'Asset';
}

export interface Order {
  __typename: 'Order';
  id: string;
  asset: (FuelAsset & { id: string }) | null;
  amount: string;
  seller: string;
  itemPrice: string;
  itemAsset: string;
  status: string;
  sellerDomain?: string;
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
