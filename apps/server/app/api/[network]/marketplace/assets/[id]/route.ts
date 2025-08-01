import { marketplaceClient } from '@/services/marketplace-client';

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
        asset: {
          _eq: id,
        },
      },
    });

    if (!asset) {
      return Response.json({ error: 'Asset not found' }, { status: 404 });
    }

    return Response.json(asset, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting asset' }, { status: 500 });
  }
}
