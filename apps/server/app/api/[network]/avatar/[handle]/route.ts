import { type NextRequest, NextResponse } from 'next/server';
import { getMintedAssetId, sha256, toUtf8Bytes, type Provider } from 'fuels';
import { getContractId, Nft } from '@bako-id/contracts';
import { type Networks, resolveNetwork } from '@/utils';
import { S3Service } from '@/s3';

const validateRequest = async (handle: string, provider: Provider | null) => {
  if (!handle) {
    throw new Error('handle is required as a URL parameter');
  }

  if (!provider) {
    throw new Error('Invalid network provider');
  }

  return handle;
};

const getAvatarHash = async (handle: string, provider: Provider) => {
  const nftId = getContractId(provider.url, 'nft');
  const nft = new Nft(nftId, provider);
  const assetId = getMintedAssetId(
    nft.id.toB256(),
    sha256(toUtf8Bytes(handle))
  );

  const { value: avatarHash } = await nft.functions
    .metadata({ bits: assetId }, 'avatar:hash')
    .get();

  if (!avatarHash?.B256) {
    throw new Error('Avatar hash not found');
  }

  return avatarHash.B256;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const [, network] = req.nextUrl.pathname.split('/').filter((a) => !!a);
    const provider = await resolveNetwork[network as keyof typeof Networks];

    const validatedHandle = await validateRequest(handle, provider);
    const avatarHash = await getAvatarHash(validatedHandle, provider!);

    const filePath = `avatar/${validatedHandle}/${network}/${avatarHash}`;
    const s3File = await S3Service.getFileFromS3(filePath);

    return new NextResponse(s3File, {
      headers: {
        'Content-Type': s3File.type,
      },
    });
  } catch (e) {
    const error = e as Error;
    const status =
      error.message?.includes('required') ||
      error.message?.includes('not found')
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message ?? 'Internal Error' },
      { status }
    );
  }
}
