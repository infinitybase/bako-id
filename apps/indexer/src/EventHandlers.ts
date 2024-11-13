import { Manager } from 'generated';

Manager.ManagerLogEvent.handler(async ({ event, context }) => {
  context.Records.set({
    id: `${event.params.name_hash}-${event.params.owner.payload.bits}`,
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
