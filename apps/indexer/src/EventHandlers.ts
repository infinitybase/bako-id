/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
    Manager,
} from "generated";

Manager.ManagerLogEvent.handler(async ({event, context}) => {
    context.Manager_ManagerLogEvent.set({
        id: `${event.params.name_hash}-${event.params.owner.payload.bits}`,
        name: event.params.name,
        name_hash: event.params.name_hash,
        owner: event.params.owner.payload.bits,
        period: event.params.period,
        resolver: event.params.resolver.payload.bits,
        timestamp: String(event.params.timestamp),
    });
});
