import type { Hono } from 'hono';
import type { Collection } from '@/types/marketplace';
import { parseURI } from '@/utils/formatter';
import { requestSetup } from './lib/request-setup';

export const registerCollectionMetadataRoute = (app: Hono) => {
  app.get('/collection/:collectionId', async (c) => {
    const collectionId = c.req.param('collectionId');
    const { marketplaceAPIURL, marketplaceUIURL, network } =
      await requestSetup();

    const response = await fetch(
      `${marketplaceAPIURL}/${network}/collections/${collectionId}`
    );

    const { data: collection } = (await response.json()) as {
      data: Collection;
    };

    const title = `${collection.name} | Garage`;
    const description = collection.description || 'Explore this NFT on Garage';
    const imageUrl = parseURI(collection.config.banner);
    const collectionLink = `${marketplaceUIURL}/collection/${collectionId}`;

    return c.html(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            
            <!-- Twitter Card -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@garage" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${imageUrl}" />
            <meta name="twitter:image:alt" content="${title}" />
      
          </head>
          <body>
            <script>window.location.href = '${collectionLink}';</script>
          </body>
          </html>
        `);
  });
};
