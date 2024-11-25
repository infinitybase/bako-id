// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJsonFile, putJsonFile } from '@/s3';
import { validateNetwork } from '@/utils';
import type { OffChainData } from '@bako-id/sdk';
import { Provider, TransactionResponse, hashMessage } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export type RegisterInput = {
  owner: string;
  domain: string;
  period: number;
  resolver: string;
  transactionId: string;
};

export async function POST(req: NextRequest) {
  const FILENAME = 'resolver.json';

  const bodyJson = await req.json();
  const body = bodyJson as RegisterInput;

  const [network, , _owner] = req.nextUrl.pathname
    .split('/')
    .filter((a) => !!a);

  try {
    const { chainId, url: providerUrl } = validateNetwork(network);
    const resolverFileName = `${chainId}/${FILENAME}`;
    const provider = await Provider.create(providerUrl);
    const t = new TransactionResponse(body.transactionId, provider);
    const r = await t.waitForResult();

    //valdations
    const isValidDomain = r?.mintedAssets?.find(
      (a) => a.subId === hashMessage(body.domain)
    );

    if (!isValidDomain) {
      throw new Error('Invalid minted name');
    }

    const resolverData: OffChainData = await getJsonFile(resolverFileName);

    const newData = {
      resolversName: {
        ...resolverData?.resolversName,
        [body.domain]: body.resolver,
      },
      resolversAddress: {
        // if exists dont save
        [body.resolver]: body.domain,
        ...resolverData?.resolversAddress,
      },
      records: {
        ...resolverData?.records,
        [body.owner]: [
          ...(resolverData?.records?.[body.owner] || []),
          {
            name: body.domain,
            resolver: body.resolver,
            owner: body.owner,
            assetId: r.mintedAssets[0].assetId,
          },
        ],
      },
    };

    await putJsonFile(resolverFileName, {
      ...resolverData,
      ...newData,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({});
}
