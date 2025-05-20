import { GraphQLClient } from 'graphql-request';
import {
  getSdk,
  type GQLAssetsQueryVariables,
  type GQLOrdersQueryVariables,
} from '../graphql/generated/operations';

/**
 * @description Marketplace client
 * @property {ReturnType<typeof getSdk>} sdk - The sdk
 */
export class MarketplaceClient {
  private readonly sdk: ReturnType<typeof getSdk>;
  private readonly client: GraphQLClient;

  /**
   * @description Constructor
   * @param {string} url - The url of the GraphQL API
   */
  constructor(url?: string) {
    this.client = new GraphQLClient(url ?? process.env.GRAPHQL_API_URL!);
    this.sdk = getSdk(this.client);
  }

  /**
   * @description Get assets
   * @param {GQLAssetsQueryVariables} variables - The variables
   * @returns {Promise<Asset[]>} - The assets
   */
  async getAssets(variables?: GQLAssetsQueryVariables) {
    const { data } = await this.sdk.assets(variables);

    return data.Asset;
  }

  /**
   * @description Get orders
   * @param {GQLOrdersQueryVariables} variables - The variables
   * @returns {Promise<Order[]>} - The orders
   */
  async getOrders(variables?: GQLOrdersQueryVariables) {
    const { data } = await this.sdk.orders(variables);

    return data.Order;
  }

  /**
   * @description Get orders count
   * @param {GQLOrdersQueryVariables} variables - The variables
   * @returns {Promise<number>} - The orders count
   */
  async getOrdersCount(variables?: GQLOrdersQueryVariables): Promise<number> {
    const { data } = await this.sdk.countOrders(variables);

    const total = data.Order.length;
    return total;
  }
}
