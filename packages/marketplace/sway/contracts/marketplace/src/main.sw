contract;

mod events;
mod external;

use sway_libs::ownership::*;
use sway_libs::pausable::*;
use sway_libs::reentrancy::*;

use std::context::msg_amount;
use std::asset::transfer;
use std::call_frames::msg_asset_id;
use std::hash::*;
use std::string::String;
use std::option::Option;

configurable {
    RESOLVER_CONTRACT_ID: b256 = b256::zero(),
}

use external::NameResolver;

use events::{
    AssetAddedEvent,
    AssetFeeAdjustedEvent,
    Order,
    OrderCancelledEvent,
    OrderCreatedEvent,
    OrderEditedEvent,
    OrderExecutedEvent,
    OrderId,
};

/// Possible error conditions in the marketplace contract
pub enum MarketplaceError {
    /// The asset is not in the list of valid assets
    AssetNotValid: AssetId,
    /// An order with this ID already exists
    OrderAlreadyExists: OrderId,
    /// The seller doesn't have enough balance of the item
    InsufficientBalance: AssetId,
    /// The item asset was not found in the valid assets list
    ItemNotFound: AssetId,
    /// The item asset is not valid
    ItemNotValid: AssetId,
    /// The amount of items in the order is zero
    ItemAmountIsZero: (),
    /// The caller is not the owner of the order
    OrderNotOwned: (),
    /// The order was not found
    OrderNotFound: (),
    /// The payment asset doesn't match the order's requested asset
    OrderAssetNotMatch: (AssetId, AssetId),
    /// The payment amount doesn't match the order's price
    OrderAmountNotMatch: (u64, u64),
    /// The provided price is not positive (zero ou negativo)
    PriceNotPositive: (),
}

pub enum AdjustFeeType {
    FEE_0: u64,
    FEE_1: u64,
}

/// The main marketplace interface
abi Marketplace {
    /// Creates a new order in the marketplace
    ///
    /// # Arguments
    /// * `asset`: The asset ID that the seller wants to receive
    /// * `price`: The price in the requested asset
    ///
    /// # Reverts
    /// * When the asset is not valid
    /// * When the item amount is zero
    /// * When an order with the same ID already exists
    /// * When the price is not positiveivoivoivoivoivoivoivoivo
    ///
    /// # Events
    /// * `OrderCreatedEvent`: Emitted when the order is successfully created
    #[storage(read, write), payable]
    fn create_order(asset: AssetId, price: u64);

    /// Executes an existing order
    ///
    /// # Arguments
    /// * `order_id`: The ID of the order to execute
    ///
    /// # Reverts
    /// * When the order doesn't exist
    /// * When the payment asset doesn't match
    /// * When the payment amount doesn't match
    ///
    /// # Events
    /// * `OrderExecutedEvent`: Emitted when the order is successfully executed
    #[storage(read, write), payable]
    fn execute_order(order_id: OrderId);

    /// Cancels an existing order
    ///
    /// # Arguments
    /// * `order_id`: The ID of the order to cancel
    ///
    /// # Reverts
    /// * When the order doesn't exist
    /// * When the caller is not the order owner
    ///
    /// # Events
    /// * `OrderCancelledEvent`: Emitted when the order is successfully cancelled
    #[storage(read, write)]
    fn cancel_order(order_id: OrderId);

    /// Retrieves an order by its ID
    ///
    /// # Arguments
    /// * `order_id`: The ID of the order to retrieve
    ///
    /// # Returns
    /// * `Option<Order>`: The order if found, None otherwise
    #[storage(read)]
    fn get_order(order_id: OrderId) -> Option<Order>;

    /// Edit an existing order
    ///
    /// #Arguments
    /// * `order_id`: The ID of the order to edit
    /// * `asset`: The asset ID that the seller wants to receive
    /// * `price`: The price in the requested asset
    ///
    /// #Reverts
    /// * When the price is not positive
    /// * When the order doesn't exist
    /// * When the caller is not the order owner
    #[storage(read, write)]
    fn edit_order(order_id: OrderId, asset: AssetId, price: u64);
}

/// Interface for managing fees in the marketplace
abi FeeManager {
    /// Adds a new valid asset to the marketplace with its fee percentage
    ///
    /// # Arguments
    /// * `asset`: The asset ID to add
    /// * `fee`: The fees percentage in basis points (1% = 100)
    ///
    /// # Events
    /// * `AssetAddedEvent`: Emitted when the asset is successfully added
    #[storage(read, write)]
    fn add_valid_asset(asset: AssetId, fee: (u64, u64));

    /// Adjusts the fee percentage for an existing asset
    ///
    /// # Arguments
    /// * `asset`: The asset ID to adjust
    /// * `fee`: The new fee percentage in basis points
    ///
    /// # Events
    /// * `AssetFeeAdjustedEvent`: Emitted when the fee is successfully adjusted
    #[storage(read, write)]
    fn adjust_fee(asset: AssetId, fee: AdjustFeeType);
}

/// Interface for managing ownership of the marketplace contract
abi Ownership {
    /// Initializes the contract with an initial owner
    ///
    /// # Arguments
    /// * `owner`: The initial owner of the contract
    ///
    /// # Events
    /// * `OwnershipTransferredEvent`: Emitted when the ownership is successfully transferred
    #[storage(read, write)]
    fn initialize(owner: Identity);

    /// Transfers ownership of the contract to a new owner
    ///
    /// # Arguments
    /// * `new_owner`: The new owner of the contract
    ///
    /// # Events
    /// * `OwnershipTransferredEvent`: Emitted when the ownership is successfully transferred
    #[storage(write)]
    fn transfer_ownership(new_owner: Identity);
}

/// Contract storage
storage {
    /// Map of order IDs to orders
    orders: StorageMap<OrderId, Order> = StorageMap {},
    /// Map of valid assets to their fees
    valid_assets: StorageMap<AssetId, (u64, u64)> = StorageMap {},
    /// Map of collected fees per asset
    collected_fees: StorageMap<AssetId, u64> = StorageMap {},
}

fn _get_order_id(order: Order) -> OrderId {
    sha256((order.seller, order.item_asset))
}

fn _calculate_fee(amount: u64, fee: Option<u64>) -> u64 {
    if fee.is_some() {
        let fee = fee.unwrap();
        return (amount * fee) / 10000;
    }
    return 0;
}

#[storage(read)]
fn _split_fee(amount: u64, sender: Identity, asset: AssetId) -> (u64, u64) {
    let resolver = abi(NameResolver, RESOLVER_CONTRACT_ID);

    let fees = storage.valid_assets.get(asset).try_read().unwrap_or((0, 0));

    // Check if the sender has a Bako ID
    let fee_percentage = match resolver.name(sender) {
        // if the Sender has Bako ID, use the fee in the second position (discount)
        Some(_) => fees.1,
        // if the Sender doesn't have Bako ID, use the fee in the first position (regular)
        None => fees.0,
    };

    let fee = _calculate_fee(amount, Some(fee_percentage));
    let seller_amount = amount - fee;
    (seller_amount, fee)
}

impl FeeManager for Contract {
    #[storage(read, write)]
    fn add_valid_asset(asset: AssetId, fee: (u64, u64)) {
        only_owner();
        storage.valid_assets.insert(asset, fee);
        log(AssetAddedEvent { asset, fee });
    }

    #[storage(read, write)]
    fn adjust_fee(asset: AssetId, fee_change: AdjustFeeType) {
        only_owner();
        let asset_fee = storage.valid_assets.get(asset).try_read();
        require(asset_fee.is_some(), MarketplaceError::AssetNotValid(asset));
        let asset_fee = asset_fee.unwrap();

        let new_fee = match fee_change {
            AdjustFeeType::FEE_0(fee) => (fee, asset_fee.1),
            AdjustFeeType::FEE_1(fee) => (asset_fee.0, fee),
        };

        storage.valid_assets.insert(asset, new_fee);
        log(AssetFeeAdjustedEvent {
            asset,
            fee: new_fee,
        });
    }
}

impl Marketplace for Contract {
    #[storage(read, write), payable]
    fn create_order(asset: AssetId, price: u64) {
        require_not_paused();
        let seller = msg_sender().unwrap();

        let item_asset = msg_asset_id();
        let amount = msg_amount();

        require(
            !item_asset
                .is_zero(),
            MarketplaceError::ItemNotValid(item_asset),
        );

        require(amount > 0, MarketplaceError::ItemAmountIsZero);

        require(price > 0, MarketplaceError::PriceNotPositive);

        require(
            storage
                .valid_assets
                .get(asset)
                .try_read()
                .is_some(),
            MarketplaceError::AssetNotValid(asset),
        );

        let order = Order {
            asset,
            amount,
            seller,
            item_price: price,
            item_asset,
        };

        let order_id = _get_order_id(order);
        require(
            storage
                .orders
                .get(order_id)
                .try_read()
                .is_none(),
            MarketplaceError::OrderAlreadyExists(order_id),
        );

        storage.orders.insert(order_id, order);

        log(OrderCreatedEvent {
            order_id,
            order,
        });
    }

    #[storage(read, write), payable]
    fn execute_order(order_id: OrderId) {
        require_not_paused();
        reentrancy_guard();

        let order = storage.orders.get(order_id).try_read();
        require(order.is_some(), MarketplaceError::OrderNotFound);

        let order = order.unwrap();
        let asset = msg_asset_id();
        let amount = msg_amount();

        require(
            asset == order.asset,
            MarketplaceError::OrderAssetNotMatch((asset, order.asset)),
        );

        require(
            amount == order.item_price,
            MarketplaceError::OrderAmountNotMatch((amount, order.item_price)),
        );

        let buyer = msg_sender().unwrap();
        transfer(buyer, order.item_asset, order.amount);

        let (seller_amount, fee) = _split_fee(amount, buyer, asset);
        transfer(order.seller, asset, seller_amount);
        storage.collected_fees.insert(asset, fee);

        storage.orders.remove(order_id);

        log(OrderExecutedEvent {
            amount: seller_amount,
            order_id,
            buyer,
            asset,
            fee,
        });
    }

    #[storage(read, write)]
    fn cancel_order(order_id: OrderId) {
        reentrancy_guard();

        let order = storage.orders.get(order_id).try_read();
        require(order.is_some(), MarketplaceError::OrderNotFound);

        let order = order.unwrap();
        require(
            order.seller == msg_sender()
                .unwrap(),
            MarketplaceError::OrderNotOwned,
        );

        transfer(order.seller, order.item_asset, order.amount);
        storage.orders.remove(order_id);

        log(OrderCancelledEvent { order_id });
    }

    #[storage(read)]
    fn get_order(order_id: OrderId) -> Option<Order> {
        storage.orders.get(order_id).try_read()
    }

    #[storage(read, write)]
    fn edit_order(order_id: OrderId, asset: AssetId, price: u64) {
        require_not_paused();

        let order = storage.orders.get(order_id).try_read();
        require(order.is_some(), MarketplaceError::OrderNotFound);

        let mut order = order.unwrap();
        require(
            order.seller == msg_sender()
                .unwrap(),
            MarketplaceError::OrderNotOwned,
        );

        require(price > 0, MarketplaceError::PriceNotPositive);

        require(
            storage
                .valid_assets
                .get(asset)
                .try_read()
                .is_some(),
            MarketplaceError::AssetNotValid(asset),
        );

        order.asset = asset;
        order.item_price = price;

        storage.orders.insert(order_id, order);

        log(OrderEditedEvent {
            order_id,
            new_asset: asset,
            new_price: price,
        });
    }
}

impl Ownership for Contract {
    #[storage(read, write)]
    fn initialize(owner: Identity) {
        initialize_ownership(owner);
    }

    #[storage(write)]
    fn transfer_ownership(new_owner: Identity) {
        transfer_ownership(new_owner);
    }
}

impl Pausable for Contract {
    #[storage(write)]
    fn pause() {
        only_owner();
        _pause();
    }

    #[storage(write)]
    fn unpause() {
        only_owner();
        _unpause();
    }

    #[storage(read)]
    fn is_paused() -> bool {
        _is_paused()
    }
}
