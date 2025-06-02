import { NetworkId, resolverNetworkByChainId } from '@/utils';
import type { OrderResponse } from './getOrderMetadata';

interface RequestOptions extends RequestInit {
  url: string;
  params?: Record<string, string | number>;
  body?: BodyInit;
}

const request = async <Response>(
  options: RequestOptions
): Promise<Response> => {
  const req = await fetch(options.url, {
    ...options,
    method: options.method || 'GET',
  });

  if (!req.ok) {
    throw new Error(`Error: ${req.status} ${req.statusText}`);
  }

  return await req.json();
};

export const getOrders = async (
  address: string,
  params?: Record<string, string>
) => {
  const queryParams = new URLSearchParams(params).toString();
  const chainId = params?.chainId;
  const network = resolverNetworkByChainId(
    Number(chainId || NetworkId.MAINNET)
  );
  const response = await request<{ orders: OrderResponse[]; total: number }>({
    url: `/api/${network}/marketplace/account/${address}/orders?${queryParams}`,
    method: 'GET',
  });

  return response;
};

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const getOrder = async (
  address: string,
  orderId: string,
  chainId: number
) => {
  try {
    const network = resolverNetworkByChainId(chainId);
    const response = await request<OrderResponse>({
      url: `${BASE_APP_URL}/api/${network}/marketplace/orders/${address}/${orderId}`,
      method: 'GET',
    });

    return response;
  } catch {
    return null;
  }
};
