import { type Account, type BN, Provider } from 'fuels';
import { GraphQLClient } from 'graphql-request';
import { Marketplace } from '../artifacts';
import {
  type GQLAssetsQueryVariables,
  type GQLOrdersQueryVariables,
  getSdk,
} from '../graphql/generated/operations';
import { callAndWait, getContractId } from '../utils';

/**
 * @description Order type
 * @property {string} asset - The asset to be sold
 * @property {BN} amount - The amount of the asset to be sold
 * @property {BN} price - The price of the asset
 * @property {string} priceAsset - The asset to be used as the price
 */
type Order = {
  itemAsset: string;
  itemAmount: BN;
  sellPrice: BN;
  sellAsset: string;
};

/**
 * @description Order type for updating an order
 * @property {BN} sellPrice - The price of the asset
 * @property {string} sellAsset - The asset to be used as the price
 */
type UpdateOrder = {
  sellPrice: BN;
  sellAsset: string;
};

/**
 * @description Marketplace contract
 * @property {Marketplace} marketplace - The marketplace contract
 * @property {Account | null} account - The account to be used to create the contract
 */
export class MarketplaceContract {
  private readonly marketplace: Marketplace;
  private readonly account: Account | null;

  /**
   * @description Constructor
   * @param {string} contractId - The contract id
   * @param {Account | Provider} accountOrProvider - The account or provider
   */
  constructor(contractId: string, accountOrProvider: Account | Provider) {
    this.marketplace = new Marketplace(contractId, accountOrProvider);
    this.account =
      accountOrProvider instanceof Provider ? null : accountOrProvider;
  }

  /**
   * @description Create a new marketplace contract
   * @param {Account | Provider} accountOrProvider - The account or provider
   * @returns {MarketplaceContract} - The marketplace contract
   */
  static async create(accountOrProvider: Account | Provider) {
    const provider =
      accountOrProvider instanceof Provider
        ? accountOrProvider
        : accountOrProvider.provider;

    const contractId = getContractId(await provider.getChainId());
    return new MarketplaceContract(contractId, accountOrProvider);
  }

  /**
   * @description Create a new order
   * @param {Order} order - The order to be created
   * @returns {Promise<{ orderId: string; transactionResult: TransactionResult }>} - The order id and transaction result
   */
  async createOrder(order: Order) {
    if (!this.account) {
      throw new Error('Account is not set');
    }

    const { itemAmount, itemAsset } = order;

    const itemAssetBalance = await this.account.getBalance(itemAsset);
    if (!itemAssetBalance || !itemAssetBalance.gte(itemAmount)) {
      const available = itemAssetBalance.formatUnits();
      throw new Error(
        `Insufficient balance for ${itemAsset}: expected ${itemAmount}, available ${available}`,
      );
    }

    const response = await callAndWait(
      this.marketplace.functions
        .create_order({ bits: order.sellAsset }, order.sellPrice)
        .callParams({
          forward: {
            amount: order.itemAmount,
            assetId: order.itemAsset,
          },
        }),
    );

    const {
      logs: [orderCreatedEvent],
      transactionResult,
    } = response;

    return {
      orderId: orderCreatedEvent.order_id,
      transactionResult,
    };
  }

  /**
   * @description Cancel an order
   * @param {string} orderId - The order id
   * @returns {Promise<{ transactionResult: TransactionResult }>} - The transaction result
   */
  async cancelOrder(orderId: string) {
    if (!this.account) {
      throw new Error('Account is not set');
    }

    const response = await callAndWait(
      this.marketplace.functions.cancel_order(orderId),
    );

    return {
      transactionResult: response.transactionResult,
    };
  }

  /**
   * @description Execute an order
   * @param {string} orderId - The order id
   * @returns {Promise<{ transactionResult: TransactionResult }>} - The transaction result
   */
  async executeOrder(orderId: string) {
    if (!this.account) {
      throw new Error('Account is not set');
    }

    const order = await this.getOrder(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    const { sellAsset, sellPrice } = order;
    const sellAssetBalance = await this.account.getBalance(sellAsset);
    if (!sellAssetBalance || !sellAssetBalance.gte(sellPrice)) {
      const available = sellAssetBalance.formatUnits();
      throw new Error(
        `Insufficient balance for ${sellAsset}: expected ${sellPrice}, available ${available}`,
      );
    }

    const response = await callAndWait(
      this.marketplace.functions.execute_order(orderId).callParams({
        forward: {
          amount: sellPrice,
          assetId: sellAsset,
        },
      }),
    );

    return {
      transactionResult: response.transactionResult,
    };
  }

  /**
   * @description Get an order
   * @param {string} orderId - The order id
   * @returns {Promise<Order | null>} - The order
   */
  async getOrder(orderId: string): Promise<Order | null> {
    const { value } = await callAndWait(
      this.marketplace.functions.get_order(orderId),
    );

    if (!value) {
      return null;
    }

    return {
      itemAsset: value.item_asset.bits,
      sellAsset: value.asset.bits,
      itemAmount: value.amount,
      sellPrice: value.item_price,
    };
  }

  /**
   * @description Update an order
   * @param {string} orderId - The order id
   * @param {Order} order - The order to be updated
   * @returns {Promise<{ transactionResult: TransactionResult }>} - The transaction result
   */
  async updateOrder(orderId: string, order: UpdateOrder) {
    if (!this.account) {
      throw new Error('Account is not set');
    }

    const response = await callAndWait(
      this.marketplace.functions.edit_order(
        orderId,
        { bits: order.sellAsset },
        order.sellPrice,
      ),
    );

    return {
      transactionResult: response.transactionResult,
    };
  }
}

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
}
