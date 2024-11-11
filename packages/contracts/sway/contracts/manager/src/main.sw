contract;

mod events;

use std::string::String;
use std::hash::{sha256, Hash};
use std::storage::storage_string::*;
use std::block::timestamp;

use lib::abis::manager::{RecordData, Manager, ManagerInfo};
use events::{ManagerLogEvent};


storage {
    records_data: StorageMap<b256, RecordData> = StorageMap {},
    records_name: StorageMap<b256, StorageString> = StorageMap {},
    records_resolver: StorageMap<Identity, b256> = StorageMap {},
    owner: Identity = Identity::Address(Address::zero()),
}

enum ManagerError {
    OnlyOwner: (),
    RecordNotFound: (),
    RecordAlreadyExists: (),
    ContractNotInitialized: (),
    ContractAlreadyInitialized: (),
}

#[storage(read)]
fn only_owner(name: String) {
    let sender = msg_sender().unwrap();
    let contract_owner = storage.owner.read();

    require(
        contract_owner != Identity::Address(Address::zero()), 
        ManagerError::ContractNotInitialized
    );

    let is_record_owner = match storage.records_data.get(sha256(name)).try_read() {
        Some(data) => data.owner == sender,
        None => false,
    };
    let is_contract_owner = storage.owner.read() == sender;
    require(
        is_record_owner || is_contract_owner, 
        ManagerError::OnlyOwner
    );
}

impl Manager for Contract {
    #[storage(read, write)]
    fn set_record(name: String, data: RecordData) {
        only_owner(name);
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        require(record_data.is_none(), ManagerError::RecordAlreadyExists);

        storage.records_data.insert(name_hash, data);
        storage.records_name.insert(name_hash, StorageString {});
        storage.records_name.get(name_hash).write_slice(name);

        if (storage.records_resolver.get(data.resolver).try_read().is_none()) {
            storage.records_resolver.insert(data.resolver, name_hash);
        }

        log(ManagerLogEvent {
            fnname: String::from_ascii_str("set_record"),
            name,
            owner: data.owner,
            resolver: data.resolver,
            name_hash,
            timestamp: timestamp(),
            period: data.period,
        });

    }

    #[storage(read, write)]
    fn set_resolver(name: String, resolver: Identity) {
        only_owner(name);
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        require(record_data.is_some(), ManagerError::RecordNotFound);

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
            Some(data) => {
                let year_in_seconds: u64 = 365 * 24 * 3600;
                Some(data.timestamp * (data.period.as_u64() * year_in_seconds)) 
            },
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

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity);
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Identity) {
        let current_owner = storage.owner.read();
        require(
            current_owner == Identity::Address(Address::zero()), 
            ManagerError::ContractAlreadyInitialized
        );
        storage.owner.write(owner);
    }
}