import type { FuelAsset, Metadata } from '@/services/fuel-assets';

export interface Asset {
  id: string;
  metadata: FuelAsset | null;
  fee: string;
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
  nft: Nft;
}

export interface Nft {
  id: string;
  fuelMetadata: FuelAsset | null;
  metadata: Record<string, string> & Metadata;
  contractId?: string;
  edition?: string;
  name?: string | null;
  image?: string;
  description?: string;
  ipfs: Record<string, string>;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
