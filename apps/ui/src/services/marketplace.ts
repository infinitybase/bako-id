import type { Asset } from '@/types/marketplace';
import type { OrderResponse } from '@/utils/getOrderMetadata';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export class marketplaceService {
  static async getOrders({
    account,
    page,
  }: { account: string; page: number | string }): Promise<{
    orders: OrderResponse[];
    total: number;
  }> {
    const limit = 12;
    const response = await fetch(
      `${BASE_API_URL}/marketplace/orders/${account}?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    return data;
  }

  static async getAssets(): Promise<Omit<Asset, 'metadata'>[]> {
    const response = await fetch(`${BASE_API_URL}/marketplace/assets`);

    const data = await response.json();

    return data;
  }
}
