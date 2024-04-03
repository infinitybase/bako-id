library;

use std::{
    hash::{Hash, sha256},
    string::String,
    bytes::Bytes,
};

abi StorageContract {
    #[storage(read, write)]
    fn constructor(owner: Address, registry_id: ContractId);

    #[storage(read, write)]
    fn set_implementation(registry_id: ContractId);

    #[storage(read)]
    fn get_implementation() -> Option<ContractId>;

    #[storage(read, write)]
    fn set_owner(owner: Address);

    #[storage(read)]
    fn get_owner() -> Option<Address>;

    #[storage(write)]
    fn set(hash: b256, value: Bytes);

    #[storage(read)]
    fn get(hash: b256) -> Option<Bytes>;

    #[storage(write)]
    fn reverse_set(key: b256, value: String);

    #[storage(read)]
    fn reverse_get(resolver: b256) -> String;
}
