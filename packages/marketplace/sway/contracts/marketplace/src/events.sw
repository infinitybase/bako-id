library;

/// Type alias for order ID (b256 hash)
pub type OrderId = b256;

/// Represents an order in the marketplace.
/// Contains all necessary information about a trade including assets, amounts, and seller details.
pub struct Order {
    /// The asset ID that the seller wants to receive in exchange
    pub asset: AssetId,
    /// The amount of the item being sold
    pub amount: u64,
    /// The identity of the seller
    pub seller: Identity,
    /// The price in the requested asset
    pub item_price: u64,
    /// The asset ID of the item being sold
    pub item_asset: AssetId,
}

/// Event emitted when a new order is created
pub struct OrderCreatedEvent {
    /// Unique identifier for the order
    pub order_id: OrderId,
    /// The complete order details
    pub order: Order,
}

/// Event emitted when a new asset is added to the valid assets list
pub struct AssetAddedEvent {
    /// The asset ID that was added
    pub asset: AssetId,
    /// The fee percentage for this asset (in basis points, 1% = 100)
    pub fee: (u64, u64),
}

/// Event emitted when an order is cancelled
pub struct OrderCancelledEvent {
    /// The ID of the cancelled order
    pub order_id: OrderId,
}

/// Event emitted when an order is executed
pub struct OrderExecutedEvent {
    /// The ID of the executed order
    pub order_id: OrderId,
    /// The identity of the buyer
    pub buyer: Identity,
    /// The amount of the item transferred
    pub amount: u64,
    /// The asset ID used for payment
    pub asset: AssetId,
    /// The fee amount collected
    pub fee: u64,
}

/// Event emitted when an asset's fee is adjusted
pub struct AssetFeeAdjustedEvent {
    /// The asset ID whose fee was adjusted
    pub asset: AssetId,
    /// The new fee percentage (in basis points)
    pub fee: (u64, u64),
}

/// Event emitted when an order is edited
pub struct OrderEditedEvent {
    /// Unique identifier for the order
    pub order_id: OrderId,
    /// New asset that the seller wants to receive
    pub new_asset: AssetId,
    /// New price in the requested asset
    pub new_price: u64,
}
