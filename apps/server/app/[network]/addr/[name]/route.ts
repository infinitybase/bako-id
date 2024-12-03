import { FILENAME, getJsonFile } from '@/s3';
import { validateNetwork } from '@/utils';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type NextRequest, NextResponse } from 'next/server';

export const getResolver = async (name: string, network: string) => {
  const { chainId } = validateNetwork(network);
  const resovlerFileName = `${chainId}/${FILENAME}`;
  const offChainData = await getJsonFile(resovlerFileName);
  const address =
    offChainData.resolversName[name.toString().replace('@', '') as string];
  return address;
};

export async function GET(req: NextRequest) {
  const [network, , name] = req.nextUrl.pathname.split('/').filter((a) => !!a);

  try {
    const address = await getResolver(
      name.toString().replace('@', ''),
      network
    );
    return NextResponse.json({ address: address ?? null });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
