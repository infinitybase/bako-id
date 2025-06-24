import type { Asset } from '@/types/marketplace';
import { constructUrl } from '@/utils/constructUrl';
import type { OrderResponse } from '@/utils/getOrderMetadata';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export class marketplaceService {
  static async getOrdersByAccount({
    account,
    page,
    chainId = Networks.MAINNET,
  }: { account: string; page: number | string; chainId?: number }): Promise<{
    orders: OrderResponse[];
    total: number;
  }> {
    const limit = 12;
    const network = resolveNetwork(chainId);
    const response = await fetch(
      `${BASE_API_URL}/${network}/marketplace/${account}/orders?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    return data;
  }

  static async getAssets({
    chainId = Networks.MAINNET,
  }: { chainId?: number }): Promise<Omit<Asset, 'metadata'>[]> {
    const network = resolveNetwork(chainId);
    const response = await fetch(
      `${BASE_API_URL}/${network}/marketplace/assets`
    );

    const data = await response.json();

    return data;
  }

  static async getOrders({
    page,
    limit,
    search,
    chainId = Networks.MAINNET,
  }: {
    page: number | string;
    limit: number;
    search?: string;
    chainId?: number;
  }): Promise<{
    orders: OrderResponse[];
    total: number;
  }> {
    const network = resolveNetwork(chainId);
    const url = constructUrl(`${BASE_API_URL}/${network}/marketplace/orders`, {
      page,
      limit,
      search,
    });

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async getOrderById({
    id,
    chainId = Networks.MAINNET,
  }: {
    id: string;
    chainId?: number;
  }): Promise<OrderResponse | null> {
    try {
      const network = resolveNetwork(chainId);
      const response = await fetch(
        `${BASE_API_URL}/${network}/marketplace/orders/${id}`
      );

      const data = await response.json();

      if (response.status !== 200) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  static async getAssetById({
    id,
    chainId = Networks.MAINNET,
  }: {
    id: string;
    chainId?: number;
  }): Promise<Asset | null> {
    try {
      const network = resolveNetwork(chainId);
      const response = await fetch(
        `${BASE_API_URL}/${network}/marketplace/assets/${id}`
      );

      const data = await response.json();

      return data;
    } catch {
      return null;
    }
  }
}
