import { FILENAME, getJsonFile } from '@/s3';
import { validateNetwork } from '@/utils';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const [, network, , owner] = req.nextUrl.pathname
    .split('/')
    .filter((a) => !!a);

  try {
    const { chainId } = validateNetwork(network);

    const resovlerFileName = `${chainId}/${FILENAME}`;
    const offChainData = await getJsonFile(resovlerFileName);
    const records = offChainData.records[owner as string] ?? [];
    return NextResponse.json({ records });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
