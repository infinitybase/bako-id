library;

use std::string::String;
use standards::src7::{Metadata};

abi Registry {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16);

    #[storage(write, read)]
    fn set_metadata_info(name: String, key: String, value: Metadata);

    // renew
    // transfer
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId, token_id: ContractId);
}