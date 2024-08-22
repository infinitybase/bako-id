import type { AttestationData } from '@/types';
import { Signer, hashMessage } from 'fuels';
import type { NextApiResponse } from 'next';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(
  request: NextRequest,
  response: NextApiResponse,
) {
  //@ts-ignore
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    throw NextResponse.json(
      { message: 'Token de autenticação não fornecido' },
      { status: 401 },
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const body: AttestationData = await request.json();
    const bodyHash = hashMessage(body.id + body.app + body.handle);

    const recoveredAddress = Signer.recoverAddress(
      hashMessage(bodyHash),
      token,
    );

    if (recoveredAddress.toB256() === body.address) {
      return NextResponse.json({
        status: 200,
        verified: true,
        message: 'Address match with token',
      });
    }

    return response.json({
      status: 401,
      verified: false,
      message:
        'Wallet address from token does not match with address from attestation',
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export const config = {
  matcher: '/api/verify',
};
