// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJsonFile, putJsonFile } from '@/s3';
import { hashMessage, Provider, TransactionResponse } from 'fuels';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'OPTIONS') {
    return res.status(200).send({});
  }

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const FILENAME = 'resolver.json';

  const { params, provider, tx_id } = req.body;

  //prepare info
  const _provider = await Provider.create(provider);

  const resovlerFileName = `${_provider.getChainId()}/${FILENAME}`;

  const t = new TransactionResponse(tx_id, _provider);

  const r = await t.waitForResult();

  //valdations
  const isValidDomain = r?.mintedAssets?.find(
    (a) => a.subId === hashMessage(params.domain)
  );

  if (!isValidDomain) {
    throw new Error('Invalid minted name');
  }

  const resolverData: Record<string, any> = await getJsonFile(resovlerFileName);

  const newData = {
    resolversName: {
      ...resolverData?.resolversName,
      [params.domain]: params.resolver,
    },
    resolversAddress: {
      // if exists dont save
      [params.resolver]: params.domain,
      ...resolverData?.resolversAddress,
    },
    records: {
      ...resolverData?.records,
      [params.resolver]: [
        ...(resolverData?.records?.[params.resolver] || []),
        {
          name: params.domain,
          resolver: params.resolver,
          owner: params.resolver,
          assetId: r.mintedAssets[0].assetId,
        },
      ],
    },
  };

  await putJsonFile(resovlerFileName, {
    ...resolverData,
    ...newData,
  });

  return res.status(200).json({});
}
