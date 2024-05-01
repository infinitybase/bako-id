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
use std::storage::storage_vec::*;
use std::storage::storage_bytes::*;
use std::storage::storage_string::*;
use std::bytes::Bytes;
use std::string::String;

// Pre-computed hash digest of sha256("implementation")
const IMPLEMENTATION = 0xda31012c40330e7e21538e7dd57503b16e8a0839159e96137090cccc9910b171;

storage {
    // Flag to check if the contract has been initialized
    initialized: bool = false,

    // Lookup for store the primary handle of resolver address
    // Map<ResolverAddress, NameHash>
    primary_handle: StorageMap<b256, b256> = StorageMap {},

    // Lookup for store a vector of all the handles owned by an address
    // Map<OwnerAddress, Vec<NameHash>>
    owners_handles: StorageMap<b256, StorageVec<b256>> = StorageMap {},
}

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
        return get_handle_by_namehash(key);
    }

    #[storage(write)]
    fn set_primary(key: b256, value: String) {
        with_permission(IMPLEMENTATION);
        storage.primary_handle.insert(key, sha256(value));
    }

    #[storage(read)]
    fn get_primary(resolver: b256) -> Option<Bytes> {
        let primary_namehash = storage.primary_handle.get(resolver).try_read();

        match primary_namehash {
            Some(namehash) => {
                return get_handle_by_namehash(namehash);
            },
            _ => None,
        }
    }

    #[storage(read)]
    fn get_all(owner: b256) -> Vec<Bytes> {
        let mut handles = Vec::new();
        let namehash_vec = storage.owners_handles.get(owner).load_vec();
        
        let mut i = 0;
        while i < namehash_vec.len() {
            let namehash = namehash_vec.get(i).unwrap();
            let handle = get_handle_by_namehash(namehash);
            match handle {
                Some(bytes) => handles.push(bytes),
                _ => (),
            }
            i += 1;
        }

        return handles;
    }
}

#[storage(read)]
fn get_handle_by_namehash(name_hash: b256) -> Option<Bytes> {
    match read_slice(name_hash) {
        Some(slice) => Some(Bytes::from(slice)),
        _ => None,
    }
}

#[test(should_revert)]
fn test_storage_contract_constructor_error() {
    use std::constants::*;

    let contract_abi = abi(StorageContract, CONTRACT_ID);
    contract_abi.constructor(Address::from(ZERO_B256), ContractId::from(ZERO_B256));
    contract_abi.constructor(Address::from(ZERO_B256), ContractId::from(ZERO_B256));
}