library;

use std::string::String;

abi Registry {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16);

    // renew
    // transfer
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId);
}