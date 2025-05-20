contract;

use std::string::String;
use std::hash::Hash;
use std::option::Option;
use std::storage::storage_map::*;
use std::storage::storage_string::*;

abi NameResolver {
    #[storage(read)]
    fn name(addr: Identity) -> Option<String>;
}

abi ResolverMock {
    #[storage(write)]
    fn register(sender: String, addr: Identity);
}

storage {
    names: StorageMap<Identity, StorageString> = StorageMap {},
}

impl ResolverMock for Contract {
    #[storage(write)]
    fn register(sender: String, addr: Identity) {
        // save the name in the storage
        // and associate it with the address
        storage.names.try_insert(addr, StorageString {});
        storage.names.get(addr).write_slice(sender);
    }
}

impl NameResolver for Contract {
    #[storage(read)]
    fn name(addr: Identity) -> Option<String> {
        // get name from storagee
        let key: StorageKey<StorageString> = storage.names.get(addr);
        let name: Option<String> = key.read_slice();
        name
    }
}
