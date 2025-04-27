import { MarketplaceClient } from '@bako-id/marketplace';

const MARKETPLACE_API_URL = process.env.GRAPHQL_API_URL;

export const marketplaceClient = new MarketplaceClient(MARKETPLACE_API_URL);
