import { FILENAME, getJsonFile, putJsonFile } from '@/s3';
import type { Identity } from '@/types';
import { identity, validateNetwork } from '@/utils';
import { Manager, Registry, getContractId } from '@bako-id/contracts';
import { Address, Provider, type StdString, TransactionResponse } from 'fuels';
import { type NextRequest, NextResponse } from 'next/server';

export type ChangeAddressInput = {
  domain: string;
  address: string;
  transactionId: string;
};

export async function POST(req: NextRequest) {
  const bodyJson = await req.json();
  const body = bodyJson as ChangeAddressInput;
  body.domain = body.domain.replace('@', '');
  body.address = Address.fromDynamicInput(body.address).toB256();

  const [network] = req.nextUrl.pathname.split('/').filter((a) => !!a);

  try {
    const { chainId, url: providerUrl } = validateNetwork(network);
    const resovlerFileName = `${chainId}/${FILENAME}`;
    const resolverData = await getJsonFile(resovlerFileName);

    // Get transaction event log
    const provider = await Provider.create(providerUrl);
    const transactionResponse = new TransactionResponse(
      body.transactionId,
      provider,
      {
        main: Registry.abi,
        otherContractsAbis: {
          [getContractId(providerUrl, 'manager')]: Manager.abi,
        },
      }
    );
    const { logs } = await transactionResponse.waitForResult();

    const changedOwnerEvent = logs?.at(0);
    if (!changedOwnerEvent) {
      throw new Error('Failed to change owner');
    }

    const { name, old_owner, new_owner } = changedOwnerEvent as {
      name: StdString;
      name_hash: string;
      old_owner: Identity;
      new_owner: Identity;
    };

    if (name !== body.domain) {
      throw new Error('Failed to change owner');
    }

    const oldOwner = identity(old_owner);
    const newOwner = identity(new_owner);

    const records = resolverData.records[oldOwner.address] ?? [];
    const record = records.find((r) => r.name === body.domain);

    if (!record) {
      throw new Error('Failed to change owner');
    }

    if (record.owner !== oldOwner.address) {
      throw new Error('Failed to change owner');
    }

    const { address: newOwnerAddress } = newOwner;
    const { address: oldOwnerAddress } = oldOwner;

    // Set new owner record
    const newOwnerRecords = resolverData.records[newOwnerAddress] ?? [];
    newOwnerRecords.push({
      ...record,
      owner: newOwnerAddress,
    });
    resolverData.records[newOwnerAddress] = newOwnerRecords;

    // Remove old owner record
    resolverData.records[oldOwnerAddress] = records.filter(
      (r) => r.name !== name
    );

    // Save resolver data
    await putJsonFile(resovlerFileName, resolverData);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      // @ts-ignore
      { error: e?.message ?? 'Internal Error' },
      { status: 400 }
    );
  }
}
