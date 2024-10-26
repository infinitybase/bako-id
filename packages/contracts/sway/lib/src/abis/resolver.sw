library;

use std::string::String;
use standards::src7::{Metadata};

abi Constructor {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId, metadata_id: ContractId);
}

abi AddressResolver {
    #[storage(read)]
    fn addr(name: String) -> Option<Identity>;
}

abi NameResolver {
    #[storage(read)]
    fn name(addr: Identity) -> Option<String>;
}

abi MetadataResolver {
    #[storage(read)]
    fn metadata(name: String, key: String) -> Option<Metadata>;
}