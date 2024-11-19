import { FILENAME, getJsonFile } from '@/s3';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  const resovlerFileName = `9889/${FILENAME}`;
  const offChainData = await getJsonFile(resovlerFileName);
  const resolverName = offChainData.resolversAddress[address as string];
  return res.status(200).json({ name: resolverName });
}
