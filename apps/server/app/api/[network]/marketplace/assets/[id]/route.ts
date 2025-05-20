import { marketplaceClient } from '@/services/marketplace';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ network: string; id: string }> }
) {
  try {
    const { network, id } = await params;

    const [asset] = await marketplaceClient.getAssets({
      where: {
        network: {
          _eq: network,
        },
        id: {
          _eq: id,
        },
      },
    });

    return Response.json(asset, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting asset' }, { status: 500 });
  }
}
