library;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    contract_id::ContractId,
};

pub struct NewResolverEvent {
    /// b256 of name string   
    pub domain_hash: b256,

    /// the new resolver address
    pub resolver: b256,
}

pub struct HandleMintedEvent {
    /// b256 of name string   
    pub domain_hash: b256,

    /// the resolver address
    pub owner: Identity,

    /// the owner address
    pub resolver: b256,

    /// the nft id
    pub asset: AssetId,
}