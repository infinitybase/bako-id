import crypto from 'node:crypto';
import { Manager } from 'generated';

const parseNetworkName = (chainId: number): 'MAINNET' | 'TESTNET' => {
  switch (chainId) {
    case 0:
      return 'TESTNET';
    case 9889:
      return 'MAINNET';
    default:
      throw new Error(`Unknown chainId: ${chainId}`);
  }
};

function hash(str: string) {
  const bytes = new TextEncoder().encode(str);
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

const parseSchemaId = (nameHash: string, chain: string) =>
  hash(`${nameHash}-${chain}`);

Manager.ManagerLogEvent.handler(async ({ event, context }) => {
  const networkName = parseNetworkName(event.chainId);

  const recordId = parseSchemaId(event.params.name_hash, networkName);
  const resolverId = parseSchemaId(
    event.params.resolver.payload.bits,
    networkName
  );

  context.Records.set({
    id: recordId,
    name: event.params.name,
    name_hash: event.params.name_hash,
    owner: event.params.owner.payload.bits,
    period: event.params.period,
    resolver: event.params.resolver.payload.bits,
    timestamp: String(event.params.timestamp),
    network: networkName,
  });

  const resolver = await context.AddressResolver.get(resolverId);
  if (!resolver?.id) {
    context.AddressResolver.set({
      id: resolverId,
      resolver: event.params.resolver.payload.bits,
      name: event.params.name,
      record_id: recordId,
    });
  }
});

Manager.OwnerChangedEvent.handler(async ({ event, context }) => {
  const networkName = parseNetworkName(event.chainId);
  const recordId = parseSchemaId(event.params.name_hash, networkName);
  const record = await context.Records.get(recordId);

  if (!record) return;

  context.Records.set({
    ...record,
    owner: event.params.new_owner.payload.bits,
  });
});

Manager.ResolverChangedEvent.handler(async ({ event, context }) => {
  const networkName = parseNetworkName(event.chainId);

  const recordId = parseSchemaId(event.params.name_hash, networkName);
  const record = await context.Records.get(recordId);

  if (!record) return;

  const oldResolverId = parseSchemaId(
    event.params.old_resolver.payload.bits,
    networkName
  );
  const oldResolver = await context.AddressResolver.get(oldResolverId);

  if (oldResolver && oldResolver.record_id === recordId) {
    context.AddressResolver.deleteUnsafe(oldResolverId);
  }

  const newResolverId = parseSchemaId(
    event.params.new_resolver.payload.bits,
    networkName
  );
  const newResolver = await context.AddressResolver.get(newResolverId);

  if (!newResolver) {
    context.AddressResolver.set({
      id: newResolverId,
      resolver: event.params.new_resolver.payload.bits,
      name: event.params.name,
      record_id: recordId,
    });
    context.Records.set({
      ...record,
      resolver: event.params.new_resolver.payload.bits,
    });
  }
});
