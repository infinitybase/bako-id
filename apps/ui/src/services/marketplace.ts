import type {
  Asset,
  Collection,
  MarketplacePaginatedResponse,
  MarketplacePaginatedResponseUserOrders,
  Order,
  OrderWithMedatada,
} from '@/types/marketplace';
import { constructUrl } from '@/utils/constructUrl';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';

const BASE_API_URL = import.meta.env.VITE_API_URL;

const BASE_MARKETPLACE_URL = import.meta.env.VITE_MARKETPLACE_URL;

export enum ORDER_EVENTS {
  OrderCreatedEvent = 'OrderCreatedEvent',
  OrderExecutedEvent = 'OrderExecutedEvent',
  OrderCancelledEvent = 'OrderCancelledEvent',
  OrderEditedEvent = 'OrderEditedEvent',
}

export class marketplaceService {
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

  static async getCollection({
    collectionId,
    chainId = Networks.MAINNET,
  }: {
    collectionId: string;
    chainId?: number;
  }): Promise<{ data: Collection }> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_MARKETPLACE_URL}/${network}/collections/${collectionId}`,
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
      `${BASE_MARKETPLACE_URL}/${network}/orders/${orderId}`,
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
      `${BASE_MARKETPLACE_URL}/${network}/collections/${collectionId}/orders`,
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

    const url = constructUrl(`${BASE_MARKETPLACE_URL}/${network}/collections`, {
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

  static async listMintableCollections({

    chainId = Networks.MAINNET,
    limit,
  }: {

    chainId: number;
    limit?: number;
  }): Promise<{ data: Collection[] }> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(`${BASE_MARKETPLACE_URL}/${network}/collections/featured`, {
      limit,
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
      `${BASE_MARKETPLACE_URL}/${network}/user/orders/${sellerAddress}`,
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

  static async saveReceipt(data: {
    txId: string;
    chainId: number;
  }) {

    const { txId, chainId } = data;
    const network = resolveNetwork(chainId);

    try {
      const url = constructUrl(`${BASE_MARKETPLACE_URL}/${network}/receipts/tx/${txId}`, {});

      const response = await fetch(url, {
        method: 'POST',
      });

      return response.json();
    } catch {
      return null
    }

  }

  static async getReceiptStatus(data: {
    txId: string;
    chainId: number;
  }): Promise<{
    success: boolean;
    data: {
      isProcessed: boolean;
      event: keyof typeof ORDER_EVENTS;
    };
  } | null> {
    const { txId, chainId } = data;
    const network = resolveNetwork(chainId);

    try {
      const url = constructUrl(`${BASE_MARKETPLACE_URL}/${network}/receipts/tx/${txId}`, {});

      const response = await fetch(url);

      return response.json();
    } catch {
      return null
    }
  }
}
