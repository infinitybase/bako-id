import { marketplaceClient } from '@/services/marketplace';

export async function GET() {
  try {
    const assets = await marketplaceClient.getAssets();

    return Response.json(assets, { status: 200 });
  } catch {
    return Response.json({ error: 'Error on getting assets' }, { status: 500 });
  }
}
