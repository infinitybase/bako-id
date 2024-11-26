import { FILENAME, getJsonFile, putJsonFile } from '@/s3';
import type { Identity } from '@/types';
import { identity, validateNetwork } from '@/utils';
import { Manager, Registry, getContractId } from '@bako-id/contracts';
import {
  Address,
  AddressType,
  Provider,
  type StdString,
  TransactionResponse,
} from 'fuels';
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
    const managerId = getContractId(providerUrl, 'manager');
    const transactionResponse = new TransactionResponse(
      body.transactionId,
      provider,
      {
        main: Registry.abi,
        otherContractsAbis: {
          [managerId]: Manager.abi,
        },
      }
    );
    const { logs, operations } = await transactionResponse.waitForResult();

    const hasManager = operations?.find(
      (op) =>
        op.to?.address === managerId && op.to?.type === AddressType.contract
    );
    const changedResolverEvent = logs?.at(0);
    if (!changedResolverEvent || !hasManager) {
      throw new Error('Failed to change owner');
    }

    const { name, old_resolver, new_resolver } = changedResolverEvent as {
      name: StdString;
      name_hash: string;
      old_resolver: Identity;
      new_resolver: Identity;
    };

    if (name !== body.domain) {
      throw new Error('Failed to change resolver');
    }

    const oldResolver = identity(old_resolver);
    const newResolver = identity(new_resolver);

    const recordOwner = Object.values(resolverData.records)
      .flat()
      .find((r) => r.name === body.domain)?.owner;

    if (!recordOwner) {
      throw new Error('Failed to change resolver');
    }

    const records = resolverData.records[recordOwner] ?? [];
    const recordIndex = records.findIndex((r) => r.name === body.domain);
    const record = records.at(recordIndex);

    if (!record) {
      throw new Error('Failed to change resolver');
    }

    const { address: newResolverAddress } = newResolver;
    const { address: oldResolverAddress } = oldResolver;

    // Set new resolver in record and name resolver
    record.resolver = newResolverAddress;
    records[recordIndex] = record;

    resolverData.records[recordOwner] = records;
    resolverData.resolversName[name] = newResolverAddress;

    // Delete old resolver address if not used and set new resolver address
    if (!resolverData.resolversAddress[newResolverAddress]) {
      delete resolverData.resolversAddress[oldResolverAddress];
      resolverData.resolversAddress[newResolverAddress] = name;
    }

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
