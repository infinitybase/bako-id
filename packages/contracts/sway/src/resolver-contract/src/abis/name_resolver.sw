library;

use std::{ string::String };
use libraries::{
    abis::{StorageContract},
    structures::{BakoHandle},
};

abi NameResolver {
    #[storage(read)]
    fn name(address: b256) -> String;
}

pub fn _name(resolver: b256, bako_id: ContractId) -> String {
    let storage = abi(StorageContract, bako_id.into());
    match storage.get_primary(resolver) {
        Some(bytes) => BakoHandle::from(bytes).name,
        _ => String::from_ascii_str(""),
    }
}