library;

use std::string::String;
use standards::src7::{Metadata};

abi Registry {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16);

    #[storage(write, read)]
    fn set_metadata_info(name: String, key: String, value: Metadata);

    #[storage(write, read)]
    fn set_owner(name: String, owner: Identity);

    #[storage(write, read)]
    fn set_resolver(name: String, resolver: Identity);

    #[storage(write, read)]
    fn set_primary_handle(name: String);
}

abi RegistryInfo {
    #[storage(read)]
    fn ttl(name: String) -> Option<u64>;

    #[storage(read)]
    fn timestamp(name: String) -> Option<u64>;
}

abi Ownership {
    #[storage(read, write)]
    fn transfer_ownership(new_owner: Address);

    #[storage(read)]
    fn transfer_funds(amount: u64, asset_id: AssetId, recipien: Address);
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Address, manager_id: ContractId, token_id: ContractId);
}