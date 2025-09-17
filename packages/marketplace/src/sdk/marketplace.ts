import {
  type Account,
  bn,
  type BN,
  Provider,
  type ScriptTransactionRequest,
} from 'fuels';
import { Marketplace } from '../artifacts';
import { callAndWait, getContractId } from '../utils';

/**
 * @description Enum for marketplace actions that can be simulated
 */
export enum MarketplaceAction {
  CREATE_OR_UPDATE_ORDER = 'create_or_update_order',
  CANCEL_ORDER = 'cancel_order',
  EXECUTE_ORDER = 'execute_order',
}

/**
 * @description Order type
 * @property {string} asset - The asset to be sold
 * @property {BN} amount - The amount of the asset to be sold
 * @property {BN} price - The price of the asset
 * @property {string} priceAsset - The asset to be used as the price
 */
export type Order = {
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
export type UpdateOrder = {
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

    const contractId = getContractId(
      await provider.getChainId(),
      'marketplace'
    );
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
        `Insufficient balance for ${itemAsset}: expected ${itemAmount}, available ${available}`
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
        })
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
      this.marketplace.functions.cancel_order(orderId)
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
        `Insufficient balance for ${sellAsset}: expected ${sellPrice}, available ${available}`
      );
    }

    const response = await callAndWait(
      this.marketplace.functions.execute_order(orderId).callParams({
        forward: {
          amount: sellPrice,
          assetId: sellAsset,
        },
      })
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
    const { value } = await this.marketplace.functions.get_order(orderId).get();

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
        order.sellPrice
      )
    );

    return {
      transactionResult: response.transactionResult,
    };
  }

  /**
   * @description Simulate an order
   * @param {Order} order - The order to be simulated
   * @param {string} orderId - The order id
   * @param {MarketplaceAction} actionToSimulate - The action to simulate
   * @returns {Promise<{ fee: BN }>} - The estimated fee
   */

  async simulate(
    orderId: string,
    actionToSimulate: MarketplaceAction,
    orderToCreate?: Order
  ) {

    if (!this.account) {
      throw new Error('Account is not set');
    }

    let order: Order | null = null;


    if (orderId.length > 0) {
      order = await this.getOrder(orderId);
    }

    let transactionRequest: ScriptTransactionRequest;

    switch (actionToSimulate) {
      case MarketplaceAction.CREATE_OR_UPDATE_ORDER:
        transactionRequest = await this.marketplace.functions
          .create_order({ bits: orderToCreate!.sellAsset }, orderToCreate!.sellPrice)
          .callParams({
            forward: {
              amount: orderToCreate!.itemAmount,
              assetId: orderToCreate!.itemAsset,
            },
          })
          .getTransactionRequest();
        break;

      case MarketplaceAction.CANCEL_ORDER:
        transactionRequest = await this.marketplace.functions
          .cancel_order(orderId)
          .getTransactionRequest();
        break;

      case MarketplaceAction.EXECUTE_ORDER:
        transactionRequest = await this.marketplace.functions
          .execute_order(orderId)
          .callParams({
            forward: {
              amount: order!.sellPrice,
              assetId: order!.sellAsset,
            },
          })
          .getTransactionRequest();
        break;
    }

    let fee = bn(0);

    try {
      const { gasUsed, minFee } =
        await this.account.getTransactionCost(transactionRequest);

      fee = gasUsed.add(minFee);
    } catch {
      // Around 0.000445 ETH
      fee = bn(445);
    }


    return {
      fee
    };

  }
}
