library;

use std::string::String;

pub struct NewNameEvent {
    /// the name string
    pub name: String,

    /// b256 of name string   
    pub name_hash: b256,

    /// the resolver address
    pub owner: Identity,

    /// the owner address
    pub resolver: Identity,

    /// the nft id
    pub asset_id: AssetId,

    /// the ttl
    pub ttl: u64,
}