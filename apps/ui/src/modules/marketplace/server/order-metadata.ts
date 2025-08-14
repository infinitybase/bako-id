import type { Hono } from 'hono';
import { parseURI } from '@/utils/formatter';
import { requestSetup } from './lib/request-setup';

export const registerOrderMetadataRoute = (app: Hono) => {
  app.get('/:orderId', async (c) => {
    const orderId = c.req.param('orderId');
    const collectionId = c.req.query('collectionId');
    const { marketplaceAPIURL, marketplaceUIURL, network } =
      await requestSetup();

    const response = await fetch(
      `${marketplaceAPIURL}/${network}/orders/${orderId}`
    );
    const { data: order } = await response.json();

    const itemPrice = order.price.amount;
    const assetSymbol = order.price.symbol;
    const title = `${order.asset.name} | ${itemPrice} ${assetSymbol} | Garage`;
    const description =
      order.asset.metadata.description || 'Explore this NFT on Garage';
    const imageUrl = parseURI(order.asset.image);
    const orderLink = `${marketplaceUIURL}/collection/${collectionId}/order/${orderId}`;

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
          <script>window.location.href = '${orderLink}';</script>
        </body>
        </html>
      `);
  });
};
