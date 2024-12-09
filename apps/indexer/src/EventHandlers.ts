import { Manager } from 'generated';

Manager.ManagerLogEvent.handler(async ({ event, context }) => {
  const recordId = event.params.name_hash;
  const resolverId = event.params.resolver.payload.bits;

  context.Records.set({
    id: recordId,
    name: event.params.name,
    name_hash: event.params.name_hash,
    owner: event.params.owner.payload.bits,
    period: event.params.period,
    resolver: event.params.resolver.payload.bits,
    timestamp: String(event.params.timestamp),
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
  const recordId = event.params.name_hash;
  const record = await context.Records.get(recordId);

  if (!record) return;

  context.Records.set({
    ...record,
    owner: event.params.new_owner.payload.bits,
  });
});

Manager.ResolverChangedEvent.handler(async ({ event, context }) => {
  const recordId = event.params.name_hash;
  const record = await context.Records.get(recordId);

  if (!record) return;

  const oldResolverId = event.params.old_resolver.payload.bits;
  const oldResolver = await context.AddressResolver.get(oldResolverId);

  if (oldResolver && oldResolver.record_id === recordId) {
    context.AddressResolver.deleteUnsafe(oldResolverId);
  }

  const newResolverId = event.params.new_resolver.payload.bits;
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
