import { graphqlClient } from '@/services/graphql';

export const getResolver = async (name: string, network: string) => {
  const { data } = await graphqlClient.sdk.resolver({
    name,
    network: network.toUpperCase(),
  });

  const record = data.Records.at(0);
  return record?.resolver ?? null;
};
