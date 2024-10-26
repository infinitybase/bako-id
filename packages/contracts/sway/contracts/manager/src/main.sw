contract;

use std::hash::{sha256, Hash};
use std::storage::storage_string::*;
use std::string::String;
use lib::abis::manager::{RecordData, Manager, ManagerInfo};

storage {
    records_data: StorageMap<b256, RecordData> = StorageMap {},
    records_name: StorageMap<b256, StorageString> = StorageMap {},
    records_resolver: StorageMap<Identity, b256> = StorageMap {},
}

impl Manager for Contract {
    #[storage(read, write)]
    fn register(name: String, data: RecordData) {
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        require(record_data.is_none(), "Record already exists");

        storage.records_data.insert(name_hash, data);
        storage.records_name.insert(name_hash, StorageString {});
        storage.records_name.get(name_hash).write_slice(name);
        storage.records_resolver.insert(data.resolver, name_hash);
    }

    #[storage(read, write)]
    fn set_resolver(name: String, resolver: Identity) {
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        require(record_data.is_some(), "Record not found");

        let mut records_data = record_data.unwrap();
        records_data.resolver = resolver;

        storage.records_data.insert(name_hash, records_data);
        storage.records_resolver.insert(resolver, name_hash);
    }
}

impl ManagerInfo for Contract {
    #[storage(read)]
    fn get_record(name: String) -> Option<RecordData> {
        let name_hash = sha256(name);
        storage.records_data.get(name_hash).try_read()
    }

    #[storage(read)]
    fn get_resolver(name: String) -> Option<Identity> {
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        
        match record_data {
            Some(data) => Some(data.resolver),
            None => None,
        }
    }

    #[storage(read)]
    fn get_owner(name: String) -> Option<Identity> {
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        
        match record_data {
            Some(data) => Some(data.owner),
            None => None,
        }
    }

    #[storage(read)]
    fn get_ttl(name: String) -> Option<u64> {
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        
        match record_data {
            Some(data) => Some(data.ttl),
            None => None,
        }
    }

    #[storage(read)]
    fn get_name(resolver: Identity) -> Option<String> {
        let name_hash = storage.records_resolver.get(resolver).try_read();

        if (name_hash.is_none()) {
            return None;
        }

        storage.records_name.get(name_hash.unwrap()).read_slice()
    }
}