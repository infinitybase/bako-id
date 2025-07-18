import { marketplaceClient } from '@/services/marketplace-client';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    const { network } = await params;

    const assets = await marketplaceClient.getAssets({
      where: {
        network: {
          _eq: network,
        },
      },
    });

    return Response.json(assets, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting assets' }, { status: 500 });
  }
}
