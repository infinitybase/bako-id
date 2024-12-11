import { graphqlClient } from '@/services/graphql';
import { Address } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const [, network, , owner] = req.nextUrl.pathname
    .split('/')
    .filter((a) => !!a);

  try {
    const { data } = await graphqlClient.sdk.records({
      owner: Address.fromString(owner).toB256(),
      network: network.toUpperCase(),
    });

    return NextResponse.json({ records: data.Records ?? [] });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
