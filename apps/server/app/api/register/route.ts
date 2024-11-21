// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJsonFile, putJsonFile } from '@/s3';
import type { OffChainData } from '@bako-id/sdk';
import { Provider, TransactionResponse, hashMessage } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const FILENAME = 'resolver.json';

  const { params, provider, tx_id } = await req.json();

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

  const resolverData: OffChainData = await getJsonFile(resovlerFileName);

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
      [params.owner]: [
        ...(resolverData?.records?.[params.owner] || []),
        {
          name: params.domain,
          resolver: params.resolver,
          owner: params.owner,
          assetId: r.mintedAssets[0].assetId,
        },
      ],
    },
  };

  await putJsonFile(resovlerFileName, {
    ...resolverData,
    ...newData,
  });

  return NextResponse.json({ success: true });
}
