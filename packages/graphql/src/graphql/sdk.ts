import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk-provider';

export type GraphqlClient = ReturnType<typeof getSdk>;

export class BakoIDGraphQLSDK {
  client: GraphQLClient;
  sdk: GraphqlClient;

  constructor(url?: string) {
    this.client = new GraphQLClient(url ?? process.env.API_URL!);
    this.sdk = getSdk(this.client);
  }
}
