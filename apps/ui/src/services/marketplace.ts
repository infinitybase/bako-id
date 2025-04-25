import { MarketplaceClient } from '@bako-id/marketplace';

const MARKETPLACE_API_URL = import.meta.env.VITE_MARKETPLACE_API_URL;

export const marketplaceClient = new MarketplaceClient(MARKETPLACE_API_URL);
