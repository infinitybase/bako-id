import type {
  Collection,
  MarketplacePaginatedResponse,
  MarketplacePaginatedResponseUserOrders,
  OrderWithMedatada,
  Order,
} from '@/types/marketplace';
import { constructUrl } from '@/utils/constructUrl';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';

const BASE_API_URL = import.meta.env.VITE_MARKETPLACE_URL;

export class newMarketplaceService {
  static async getCollection({
    collectionId,
    chainId = Networks.MAINNET,
  }: {
    collectionId: string;
    chainId?: number;
  }): Promise<{ data: Collection }> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_API_URL}/${network}/collections/${collectionId}`,
      {}
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
  static async getOrder({
    orderId,
    chainId = Networks.MAINNET,
  }: {
    orderId: string;
    chainId?: number;
  }): Promise<{ data: OrderWithMedatada }> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_API_URL}/${network}/orders/${orderId}`,
      {}
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async getCollectionOrders({
    collectionId,
    page,
    limit,
    search,
    chainId = Networks.MAINNET,
    sortValue,
    sortDirection,
  }: {
    collectionId: string;
    page: number | string;
    limit: number;
    search?: string;
    chainId?: number;
    sortValue: string;
    sortDirection: 'asc' | 'desc';
  }): Promise<MarketplacePaginatedResponse<Order>> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_API_URL}/${network}/collections/${collectionId}/orders`,
      {
        page,
        limit,
        assetId: search,
        orderBy: sortValue,
        orderDirection: sortDirection,
      }
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async listCollections({
    page,
    limit,
    search,
    chainId = Networks.MAINNET,
    sortValue,
    sortDirection,
  }: {
    page: number | string;
    limit: number;
    search?: string;
    chainId?: number;
    sortValue: string;
    sortDirection: 'asc' | 'desc';
  }): Promise<MarketplacePaginatedResponse<Collection>> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(`${BASE_API_URL}/${network}/collections`, {
      page,
      limit,
      name: search,
      orderBy: sortValue,
      orderDirection: sortDirection,
    });

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async listUserOrders({
    page,
    chainId = Networks.MAINNET,
    sellerAddress,
    limit,
  }: {
    page: number | string;
    chainId: number;
    limit?: number;
    sellerAddress: string;
  }): Promise<MarketplacePaginatedResponseUserOrders<Order>> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_API_URL}/${network}/user/orders/${sellerAddress}`,
      {
        page,
        limit: limit ?? 10,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        sellerAddress,
      }
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
}
