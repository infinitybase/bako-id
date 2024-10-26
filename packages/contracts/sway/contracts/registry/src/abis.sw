library;

use std::string::String;

abi Registry {
    #[storage(write, read)]
    fn register(name: String, resolver: Identity);

    // renew
    // transfer
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId);
}