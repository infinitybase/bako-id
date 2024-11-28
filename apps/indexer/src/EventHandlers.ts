import { Manager } from 'generated';

Manager.ManagerLogEvent.handler(async ({ event, context }) => {
  context.Records.set({
    id: event.params.name_hash,
    name: event.params.name,
    name_hash: event.params.name_hash,
    owner: event.params.owner.payload.bits,
    period: event.params.period,
    resolver: event.params.resolver.payload.bits,
    timestamp: String(event.params.timestamp),
  });

  const resolver = await context.AddressResolver.get(
    event.params.resolver.payload.bits
  );
  if (!resolver?.id) {
    context.AddressResolver.set({
      id: event.params.resolver.payload.bits,
      resolver: event.params.resolver.payload.bits,
      name: event.params.name,
    });
  }
});

Manager.OwnerChangedEvent.handler(async ({ event, context }) => {
  const record = await context.Records.get(event.params.name_hash);

  if (!record) return;
  if (record.owner !== event.params.old_owner.payload.bits) return;

  context.Records.deleteUnsafe(event.params.name_hash);
  context.Records.set({
    ...record,
    owner: event.params.new_owner.payload.bits,
  });
});

Manager.ResolverChangedEvent.handler(async ({ event, context }) => {
  context.AddressResolver.deleteUnsafe(event.params.old_resolver.payload.bits);
  context.AddressResolver.set({
    id: event.params.old_resolver.payload.bits,
    resolver: event.params.new_resolver.payload.bits,
    name: event.params.name,
  });
});
