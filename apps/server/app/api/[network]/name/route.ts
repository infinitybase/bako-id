import { graphqlClient } from '@/services/graphql';
import { Address, isB256 } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const [, network] = req.nextUrl.pathname.split('/').filter((a) => !!a);

  const addrs = req.nextUrl.searchParams.getAll('address');

  if (addrs.length === 0) return NextResponse.json({ names: [] });

  const hasInvalidAddr = addrs.some((addr) => !isB256(addr));
  if (hasInvalidAddr) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const { data } = await graphqlClient.sdk.names({
      addresses: addrs.map((addr) => Address.fromString(addr).toB256()),
      network: network.toUpperCase(),
    });

    return NextResponse.json({
      names: data.Records ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
