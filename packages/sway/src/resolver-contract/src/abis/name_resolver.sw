library;

use std::{ string::String };
use libraries::{
    abis::{StorageContract},
};

abi NameResolver {
    #[storage(read)]
    fn name(address: b256) -> String;
}

pub fn _name(resolver: b256, bako_id: ContractId) -> String {
    let storage = abi(StorageContract, bako_id.into());
    return storage.reverse_get(resolver);
}