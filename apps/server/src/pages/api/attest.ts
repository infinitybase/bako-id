import { attest } from '@bako-id/sdk';
import { Provider, Wallet } from 'fuels';
import type { NextApiRequest, NextApiResponse } from 'next';

const { API_PRIVATE_KEY, PROVIDER_URL } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const provider = await Provider.create(PROVIDER_URL!);
    const attester = Wallet.fromPrivateKey(API_PRIVATE_KEY!, provider);

    const attestationHash = await attest({
      attester,
      data: {
        id: body.id,
        app: body.app,
        handle: body.handle,
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
