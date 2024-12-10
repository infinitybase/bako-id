import { BakoIDGraphQLSDK } from '@bako-id/graphql';

const { GRAPHQL_API_URL } = process.env;

export const graphqlClient = new BakoIDGraphQLSDK(GRAPHQL_API_URL!);
