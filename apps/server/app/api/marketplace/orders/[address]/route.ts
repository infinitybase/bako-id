import { marketplaceClient } from '@/services/marketplace';
import { OrderStatus } from '@/types/marketplace';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 12;

    const where = {
      seller: {
        _eq: address,
      },
      status: {
        _eq: OrderStatus.CREATED,
      },
    };

    const total = await marketplaceClient.getOrdersCount({ where });
    const orders = await marketplaceClient.getOrders({
      where,
      offset: (page - 1) * limit,
      count: limit,
      // @ts-expect-error - sort by db_write_timestamp
      sort: { db_write_timestamp: 'desc' },
    });

    return Response.json({ orders, total }, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting orders' }, { status: 500 });
  }
}
