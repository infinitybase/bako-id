library;

use std::{
    string::String,
    contract_id::ContractId
};
use libraries::{
    structures::{FuelDomain}
};

abi FuelDomainsContract {
    #[storage(read, write)]
    fn constructor(owner: Address, storage_id: ContractId);

    #[storage(read), payable]
    fn register(name: String, resolver: b256);

    #[storage(read)]
    fn resolver(name: String) -> Option<FuelDomain>;

    #[storage(read)]
    fn reverse_name(resolver: b256) -> Option<String>;
}
