import type { Asset } from '@/types/marketplace';
import { constructUrl } from '@/utils/constructUrl';
import type { OrderResponse } from '@/utils/getOrderMetadata';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export class marketplaceService {
  static async getOrdersByAccount({
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

  static async getOrders({
    page,
    limit = 12,
    id,
  }: { page: number | string; limit?: number; id?: string }): Promise<{
    orders: OrderResponse[];
    total: number;
  }> {
    const url = constructUrl(`${BASE_API_URL}/marketplace/orders`, {
      page,
      limit,
      id,
    });

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
}
