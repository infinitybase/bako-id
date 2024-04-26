contract;

mod abis;

use std::{
    string::String,
    hash::*,
};
use libraries::{
    abis::{StorageContract},
    structures::{FuelDomain},
};
use abis::{
    address_resolver::*,
    name_resolver::*,
};

abi ResolverContract {
    #[storage(read, write)]
    fn constructor(storage_id: ContractId);
}

enum ResolverContractError {
    AlreadyInitialized: (),
    StorageNotInitialized: (),
}

storage {
    storage_id: Option<ContractId> = Option::None,
    initialized: bool = false,
}

#[storage(read)]
fn get_storage_id() -> ContractId {
    let storage_id = storage.storage_id.read();
    require(storage_id.is_some(), ResolverContractError::StorageNotInitialized);
    storage_id.unwrap()
}

impl ResolverContract for Contract {
    #[storage(read, write)]
    fn constructor(storage_id: ContractId) {
        // Check storage already intialized
        let initalized = storage.initialized.read();
        require(!initalized, ResolverContractError::AlreadyInitialized);
        storage.initialized.write(true);
        storage.storage_id.write(Option::Some(storage_id));
    }
}

impl AddressResolver for Contract {
    #[storage(read)]
    fn resolver(name: String) -> Option<b256> {
        let storage_id = get_storage_id();
        return _resolver(name, storage_id);
    }

    #[storage(read)]
    fn owner(name: String) -> Option<b256> {
        let storage_id = get_storage_id();
        return _owner(name, storage_id);
    }
}

impl NameResolver for Contract {
    #[storage(read)]
    fn name(address: b256) -> String {
        let storage_id = get_storage_id();
        return _name(address, storage_id);
    }
}
