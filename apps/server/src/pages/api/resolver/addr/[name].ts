import { FILENAME, getJsonFile } from '@/s3';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  name = name.toString().replace('@', '');
  const resovlerFileName = `9889/${FILENAME}`;
  const offChainData = await getJsonFile(resovlerFileName);
  const address = offChainData.resolversName[name as string];
  return res.status(200).json({ address });
}
