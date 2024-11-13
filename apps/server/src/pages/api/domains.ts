// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJsonFile } from '@/s3';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const FILENAME = 'resolver.json';

  const { chainId } = req.query;

  return res.status(200).json(await getJsonFile(`${chainId}/${FILENAME}`));
}
