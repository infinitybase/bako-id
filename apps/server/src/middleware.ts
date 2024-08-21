import type { AttestationData } from '@/types';
import { Signer, sha256 } from 'fuels';
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export function middleware(request: NextApiRequest) {
  //@ts-ignore
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'Token de autenticação não fornecido' },
      { status: 401 },
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const body: AttestationData =
      typeof request.body === 'string'
        ? JSON.parse(request.body)
        : request.body;
    const bodyHash = sha256(body.id + body.app + body.handle);

    const signature = Signer.recoverPublicKey(bodyHash, token);
    const recoveredAddress = Signer.recoverAddress(bodyHash, signature);

    if (recoveredAddress.toB256() !== body.address) {
      return NextResponse.json(
        { message: 'Falha na autenticação' },
        { status: 401 },
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
