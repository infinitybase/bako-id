import { attest, config } from '@bako-id/sdk';
import { Provider, Wallet } from 'fuels';
import type { NextApiRequest, NextApiResponse } from 'next';
const { API_PRIVATE_KEY } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (req.body) {
    try {
      const provider = await Provider.create(config.PROVIDER_DEPLOYED!);
      const attester = Wallet.fromPrivateKey(API_PRIVATE_KEY!, provider);

      const attestationHash = await attest({
        attester,
        data: {
          id: req.body.id,
          app: req.body.app,
          handle: req.body.handle,
        },
      });

      return res.json({
        data: attestationHash,
      });
    } catch (error) {
      return res.json({
        message: error,
      });
    }
  }
}
