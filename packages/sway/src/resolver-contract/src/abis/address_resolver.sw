library;

use std::{
    string::String,
    hash::*,
};
use libraries::{
    abis::{StorageContract},
    structures::{FuelDomain},
};

abi AddressResolver {
    #[storage(read)]
    fn resolver(name: String) -> Option<b256>;

    #[storage(read)]
    fn owner(name: String) -> Option<b256>;
}

fn get_handle_instance(name: String, bako_id: ContractId) -> Option<FuelDomain> {
    let domain_hash = sha256(name);
    let storage = abi(StorageContract, bako_id.into());
    let bytes_domain = storage.get(domain_hash);

    match bytes_domain {
        Some(bytes_domain) => {
            return Some(FuelDomain::from_bytes(bytes_domain));
        },
        _ => None,
    }
}

pub fn _resolver(name: String, bako_id: ContractId) -> Option<b256> {
    let handle = get_handle_instance(name, bako_id);

    match handle {
        Some(handle) => {
            return Some(handle.resolver);
        },
        _ => None,
    }
}

pub fn _owner(name: String, bako_id: ContractId) -> Option<b256> {
    let handle = get_handle_instance(name, bako_id);

    match handle {
        Some(handle) => {
            return Some(handle.owner);
        },
        _ => None,
    }
}