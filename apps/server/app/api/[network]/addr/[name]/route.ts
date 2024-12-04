// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type NextRequest, NextResponse } from 'next/server';
import { getResolver } from './resolver';

export async function GET(req: NextRequest) {
  const [, network, , name] = req.nextUrl.pathname
    .split('/')
    .filter((a) => !!a);

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
