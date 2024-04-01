contract;

mod errors;

use ::errors::{StorageContractError};
use libraries::{
    abis::{StorageContract},
    permissions::{
        Permission,
        OWNER,
        with_permission,
        set_permission,
        get_permission,
    }
};
use std::{
    hash::{Hash, sha256},
    intrinsics::{size_of, size_of_val},
    constants::ZERO_B256,
};
use std::{storage::{storable_slice::{write_slice, read_slice}}};
use std::storage::storage_bytes::*;
use std::storage::storage_string::*;
use std::bytes::Bytes;
use std::string::String;

storage {
    initialized: bool = false,
    reverse_handles: StorageMap<b256, StorageString> = StorageMap::<b256, StorageString> {},
}

// Pre-computed hash digest of sha256("implementation")
const IMPLEMENTATION = 0xda31012c40330e7e21538e7dd57503b16e8a0839159e96137090cccc9910b171;

impl StorageContract for Contract {
    #[storage(read, write)]
    fn constructor(owner: Address, registry_id: ContractId) {
        let initalized = storage.initialized.try_read().unwrap_or(false);
        require(!initalized, StorageContractError::AlreadyInitialized);
        storage.initialized.write(true);
        set_permission(OWNER, Identity::Address(owner));
        set_permission(IMPLEMENTATION, Identity::ContractId(registry_id));
    }

    #[storage(read, write)]
    fn set_implementation(registry_id: ContractId) {
        with_permission(OWNER);
        set_permission(IMPLEMENTATION, Identity::ContractId(registry_id));
    }

    #[storage(read)]
    fn get_implementation() -> Option<ContractId> {
        match get_permission(IMPLEMENTATION) {
            Permission::Authorized(identity) => {
                match identity {
                    Identity::ContractId(contract_id) => Some(contract_id),
                    _ => None,
                }
            },
            _ => None,
        }
    }

    #[storage(read, write)]
    fn set_owner(owner: Address) {
        with_permission(OWNER);
        set_permission(OWNER, Identity::Address(owner));
    }

    #[storage(read)]
    fn get_owner() -> Option<Address> {
        match get_permission(OWNER) {
            Permission::Authorized(identity) => {
                match identity {
                    Identity::Address(address) => Some(address),
                    _ => None,
                }
            },
            _ => None,
        }
    }

    #[storage(write)]
    fn set(key: b256, bytes_domain: Bytes) {
        with_permission(IMPLEMENTATION);
        write_slice(key, bytes_domain.as_raw_slice());
    }

    #[storage(read)]
    fn get(key: b256) -> Option<Bytes> {
        match read_slice(key) {
            Some(slice) => Some(Bytes::from(slice)),
            _ => None,
        }
    }

    #[storage(write)]
    fn reverse_set(key: b256, value: String) {
        with_permission(IMPLEMENTATION);
        storage.reverse_handles.insert(key, StorageString {});
        storage.reverse_handles.get(key).write_slice(value);
    }

    #[storage(read)]
    fn reverse_get(resolver: b256) -> String {
        return storage.reverse_handles
                .get(resolver)
                .read_slice()
                .unwrap_or(String::new());
    }
}
