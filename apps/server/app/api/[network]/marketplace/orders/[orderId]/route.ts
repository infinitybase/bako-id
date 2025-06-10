import { marketplaceClient } from '@/services/marketplace';
import { OrderStatus } from '@/types/marketplace';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ network: string; orderId: string }> }
) {
  try {
    const { network, orderId } = await params;

    const [order] = await marketplaceClient.getOrders({
      where: {
        status: {
          _eq: OrderStatus.CREATED,
        },
        network: {
          _eq: network,
        },
        id: {
          _eq: orderId,
        },
      },
    });

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(order, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on get order' }, { status: 500 });
  }
}
