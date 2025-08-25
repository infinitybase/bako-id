import { type NextRequest, NextResponse } from 'next/server';
import { type Networks, resolveNetwork } from '@/utils';
import { MetadataKeys, RegistryContract } from '@bako-id/sdk';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string; network: string }> },
) {
  try {
    const { handle, network } = await params;
    const provider = resolveNetwork[network as keyof typeof Networks];
    const registry = RegistryContract.create(provider);

    const avatarUrl = await registry.getMetadataByKey(
      handle,
      MetadataKeys.AVATAR,
    );

    return NextResponse.json({ url: avatarUrl ?? null });
  } catch (e) {
    const error = e as Error;
    const status =
      error.message?.includes('required') ||
      error.message?.includes('not found')
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message ?? 'Internal Error' },
      { status },
    );
  }
}
