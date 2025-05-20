import { MarketplaceClient } from '@bako-id/marketplace';

const MARKETPLACE_API_URL = process.env.GRAPHQL_MARKETPLACE_API_URL;

if (!MARKETPLACE_API_URL) {
  throw new Error('MARKETPLACE_API_URL is not set');
}

export const marketplaceClient = new MarketplaceClient(MARKETPLACE_API_URL);
