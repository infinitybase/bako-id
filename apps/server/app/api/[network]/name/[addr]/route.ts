import { graphqlClient } from '@/services/graphql';
import { Address } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const [, , , addr] = req.nextUrl.pathname.split('/').filter((a) => !!a);

  try {
    const { data } = await graphqlClient.sdk.get_primary_handle({
      resolver: Address.fromString(addr).toB256(),
    });

    const name = data.AddressResolver[0]?.name;
    return NextResponse.json({ name });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
