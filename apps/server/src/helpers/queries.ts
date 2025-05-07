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
  const response = await request<{ orders: OrderResponse[]; total: number }>({
    url: `/api/marketplace/orders/${address}?${queryParams}`,
    method: 'GET',
  });

  return response;
};
