library;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    contract_id::ContractId,
};

pub struct NewResolverEvent {
    /// b256 of name string   
    domain_hash: b256,

    /// the new resolver address
    resolver: b256,
}