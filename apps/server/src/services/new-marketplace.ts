import type {
  MarketplacePaginatedResponseUserOrders,
  OrderWithMedatada,
  Order,
} from '@/types/marketplace';
import { constructUrl, NetworkId, resolverNetworkByChainId } from '@/utils';

const BASE_API_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL;

export class newMarketplaceService {
  static async getOrder({
    orderId,
    chainId = NetworkId.MAINNET,
  }: {
    orderId: string;
    chainId?: number;
  }): Promise<{ data: OrderWithMedatada }> {
    const network = resolverNetworkByChainId(chainId);

    const url = constructUrl(
      `${BASE_API_URL}/${network}/orders/${orderId}`,
      {}
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async listUserOrders({
    page,
    chainId = NetworkId.MAINNET,
    sellerAddress,
    limit,
  }: {
    page: number | string;
    chainId: number;
    limit?: number;
    sellerAddress: string;
  }): Promise<MarketplacePaginatedResponseUserOrders<Order>> {
    const network = resolverNetworkByChainId(chainId);

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
