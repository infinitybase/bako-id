contract;

mod events;

use std::string::String;
use std::hash::{sha256, Hash};
use std::storage::storage_string::*;
use std::block::timestamp;
use sway_libs::{admin::*, ownership::*};
use standards::src5::{SRC5, State};

use lib::abis::manager::{RecordData, Manager, ManagerInfo};
use events::{ManagerLogEvent};


storage {
    records_data: StorageMap<b256, RecordData> = StorageMap {},
    records_name: StorageMap<b256, StorageString> = StorageMap {},
    records_resolver: StorageMap<Identity, b256> = StorageMap {},
}

enum ManagerError {
    OnlyOwner: (),
    RecordNotFound: (),
    RecordAlreadyExists: (),
    ContractNotInitialized: (),
}

#[storage(read)]
fn only_owner_or_admin() {
    let sender = msg_sender().unwrap();
    let owner = _owner();

    require(
        owner != State::Uninitialized,
        ManagerError::ContractNotInitialized
    );
    
    require(
        owner == State::Initialized(msg_sender().unwrap()) || is_admin(sender), 
        ManagerError::OnlyOwner
    );
}

impl Manager for Contract {
    #[storage(read, write)]
    fn set_record(name: String, data: RecordData) {
        only_owner_or_admin();
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
        only_owner_or_admin();
        let name_hash = sha256(name);
        let record_data = storage.records_data.get(name_hash).try_read();
        require(record_data.is_some(), ManagerError::RecordNotFound);

        if (storage.records_resolver.get(resolver).try_read().is_none()) {
            let mut records_data = record_data.unwrap();
            records_data.resolver = resolver;

            storage.records_data.insert(name_hash, records_data);
            storage.records_resolver.insert(resolver, name_hash);
        }
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
    fn constructor(owner: Identity, admin: Identity);
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Identity, admin: Identity) {
        initialize_ownership(owner);
        add_admin(admin);
    }
}

abi Admin {
    #[storage(read, write)]
    fn revoke_admin(admin: Identity);
    
    #[storage(read, write)]
    fn add_admin(admin: Identity);

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);
}

impl Admin for Contract {
    #[storage(read, write)]
    fn revoke_admin(admin: Identity) {
        only_owner();
        revoke_admin(admin);
    }

    #[storage(read, write)]
    fn add_admin(admin: Identity) {
        only_owner();
        add_admin(admin);
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        only_owner();
        transfer_ownership(new_owner);
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}