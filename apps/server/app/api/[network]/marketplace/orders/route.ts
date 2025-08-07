import { marketplaceClient } from '@/services/marketplace-client';
import { OrderStatus } from '@/types/marketplace';
import { getResolver } from '../../addr/[name]/resolver';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    const { network } = await params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 12;
    const search = url.searchParams.get('search');
    const isHandle = search?.startsWith('@');

    const resolver =
      isHandle && search
        ? await getResolver(search.replace('@', ''), network.toUpperCase())
        : null;

    const seller = resolver || search;

    const where = {
      status: {
        _eq: OrderStatus.CREATED,
      },
      network: {
        _eq: network,
      },
      // search by id | seller | asset
      ...(search && {
        _or: [
          { itemAsset: { _ilike: search } },
          { seller: { _ilike: seller } },
          { asset: { _ilike: search } },
        ],
      }),
    };

    const total = await marketplaceClient.getOrdersCount({ where });
    const orders = await marketplaceClient.getOrders({
      where,
      offset: (page - 1) * limit,
      count: limit,
      // @ts-expect-error - sort by id
      sort: { id: 'desc' },
    });

    return Response.json({ orders, total }, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting orders' }, { status: 500 });
  }
}
