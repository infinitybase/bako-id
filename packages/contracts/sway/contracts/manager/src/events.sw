library;

use std::string::String;
use std::block::timestamp;

pub struct ManagerLogEvent {
    /// the function name
    pub fnname: String,

    /// the name string
    pub name: String,

    /// the owner address
    pub owner: Identity,

    /// the resolver address
    pub resolver: Identity,

    /// the name hash
    pub name_hash: b256,

    /// the timestamp
    pub timestamp: u64,

    /// the period
    pub period: u16,
}

pub struct OwnerChangedEvent {
    /// the name string
    pub name: String,

    /// the name hash
    pub name_hash: b256,

    /// the owner address
    pub old_owner: Identity,

    /// the new owner address
    pub new_owner: Identity,
}

pub struct ResolverChangedEvent {
    /// the name string
    pub name: String,

    /// the name hash
    pub name_hash: b256,

    /// the resolver address
    pub old_resolver: Identity,

    /// the new resolver address
    pub new_resolver: Identity,
}