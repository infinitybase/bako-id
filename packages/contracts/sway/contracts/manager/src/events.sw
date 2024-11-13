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