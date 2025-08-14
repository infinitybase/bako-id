import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from 'dotenv';
import { registerOrderMetadataRoute } from './order-metadata';
import { registerCollectionMetadataRoute } from './collection-metadata';

config();

export const app = new Hono();
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3001;

registerOrderMetadataRoute(app);
registerCollectionMetadataRoute(app);

console.log(`🚀 Garage Metadata Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
});
