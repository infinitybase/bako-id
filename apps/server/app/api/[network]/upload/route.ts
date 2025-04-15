import { type NextRequest, NextResponse } from 'next/server';

import {
  Address,
  getDecodedLogs,
  getTransactionSummary,
  type JsonAbi,
  type Provider,
} from 'fuels';
import {
  getContractId,
  Manager,
  Nft,
  UploaderValidatorScript,
} from '@bako-id/contracts';
import { type Networks, resolveNetwork } from '@/utils';
import { S3Service } from '@/s3';
import type { UploaderEventLog } from '@/types';

const validateRequest = async (
  formData: FormData,
  handle: string | null,
  provider: Provider,
  nftId: string,
  managerId: string
) => {
  const transactionId = formData.get('transactionId');
  const uploadedFileHash = formData.get('uploadedFileHash');
  const unverifiedAddress = formData.get('unverifiedAddress');
  const file = formData.get('file');

  if (!handle) {
    throw new Error('handle is required as a URL parameter');
  }

  if (!transactionId) {
    throw new Error('transactionId is required as a URL parameter');
  }

  if (!(file instanceof File)) {
    throw new Error('Invalid or empty file');
  }

  const { owner, sender, file_hash } = await decodeTransactionLogs(
    transactionId as string,
    provider,
    {
      [nftId]: Nft.abi,
      [managerId]: Manager.abi,
    }
  );

  const ownerAddress = Address.fromB256(owner.Address.bits);
  const senderAddress = Address.fromB256(sender.bits);
  const unverifiedAddressB256 = Address.fromB256(unverifiedAddress as string);
  const isOwner =
    ownerAddress.equals(unverifiedAddressB256) &&
    senderAddress.equals(unverifiedAddressB256);

  if (!isOwner) {
    throw new Error(
      `This handle: ${handle} do not belongs to this wallet address.`
    );
  }

  if (uploadedFileHash !== file_hash) {
    throw new Error(`The file hash don't match.`);
  }

  return { file, file_hash: file_hash as string, handle };
};

const decodeTransactionLogs = async (
  transactionId: string,
  provider: Provider,
  otherAbis: Record<string, JsonAbi>
) => {
  const transaction = await getTransactionSummary({
    id: transactionId,
    provider,
  });

  const [, , , , uploaderEventLog] = getDecodedLogs<UploaderEventLog>(
    transaction.receipts,
    UploaderValidatorScript.abi,
    otherAbis
  );

  return uploaderEventLog;
};

export async function POST(req: NextRequest) {
  const [, network] = req.nextUrl.pathname.split('/').filter((a) => !!a);

  const provider = await resolveNetwork[network as keyof typeof Networks];
  const managerId = getContractId(provider!.url, 'manager');
  const nftId = getContractId(provider!.url, 'nft');

  try {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get('handle');
    const formData = await req.formData();

    const {
      file,
      file_hash,
      handle: validatedHandle,
    } = await validateRequest(formData, handle, provider!, nftId, managerId);

    const filePath = `avatar/${validatedHandle}/${network}/${file_hash}`;
    const fileExists = await S3Service.fileExistsInS3(filePath);

    if (!fileExists) {
      await S3Service.uploadImageToS3(filePath, file as File);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message ?? 'Internal Error' },
      { status: error.message?.includes('required') ? 400 : 500 }
    );
  }
}
