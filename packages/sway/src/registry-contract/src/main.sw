contract;

mod interface;

use ::interface::{FuelDomainsContract};
use libraries::{
    abis::{StorageContract},
    structures::{FuelDomain},
    permissions::{
        Permission,
        OWNER,
        with_permission,
        set_permission,
        get_permission,
    },
};
use std::{
    hash::{Hash, sha256},
    string::String,
    contract_id::ContractId,
    intrinsics::{size_of, size_of_val}
};
use std::storage::storage_bytes::*;
use std::bytes::Bytes;
use std::constants::{ZERO_B256};

enum RegistryContractError {
    StorageNotInitialized: (),
    AlreadyInitialized: (),
    DomainNotAvailable: (),
    DomainNotValid: (),
}

// .fuel domain in bytes
const NAME_SULFIX: [u8; 5] = [46, 102, 117, 101, 108];
const NAME_SULFIX_LEN: u64 = 5;
const NAME_MIN_LEN: u64 = 2;

storage {
    storage_id: Option<ContractId> = Option::None,
    initialized: bool = false,
}

#[storage(read)]
fn get_storage_id() -> ContractId {
    let storage_id = storage.storage_id.read();
    require(storage_id.is_some(), RegistryContractError::StorageNotInitialized);
    storage_id.unwrap()
}

fn assert_name_validity(name: String) {
    let bytes = name.as_bytes();
    let mut name_length = bytes.len;
    let mut sulfix_length = NAME_SULFIX_LEN;
    let mut is_valid = true;

    require(name_length > (NAME_MIN_LEN + NAME_SULFIX_LEN), RegistryContractError::DomainNotValid);
    while name_length > (bytes.len - 5) {
        let letter = bytes.get(name_length - 1).unwrap();
        if (letter != NAME_SULFIX[sulfix_length - 1]) {
            is_valid = false;
        }
        name_length = name_length - 1;
        sulfix_length = sulfix_length - 1;
    }
    require(is_valid, RegistryContractError::DomainNotValid);
}

impl FuelDomainsContract for Contract {
    #[storage(read, write)]
    fn constructor(owner: Address, storage_id: ContractId) {
        // Check storage already intialized
        let initalized = storage.initialized.read();
        require(!initalized, RegistryContractError::AlreadyInitialized);
        storage.initialized.write(true);

        // Set owner address in storage
        set_permission(OWNER, Identity::Address(owner));
        storage.storage_id.write(Option::Some(storage_id));
    }

    #[storage(read)]
    fn register(name: String, resolver: b256) {
        let storage_id = get_storage_id();
        let domain_hash = sha256(name);

        // Check domain is available
        let storage = abi(StorageContract, storage_id.into());
        let domain_available = storage.get(domain_hash).is_none();
        require(domain_available, RegistryContractError::DomainNotAvailable);

        /* TODO: add payable (0.0001 ETH) */
        let owner = msg_sender().unwrap().as_address().unwrap().value;
        let domain = FuelDomain::new(owner, resolver);
        storage.set(domain_hash, domain.to_bytes());
    }

    #[storage(read)]
    fn resolver(name: String) -> Option<FuelDomain> {
        let storage_id = get_storage_id();
        let domain_hash = sha256(name);
        let storage = abi(StorageContract, storage_id.into());
        let bytes_domain = storage.get(domain_hash);

        match bytes_domain {
            Some(bytes_domain) => {
                return Some(FuelDomain::from_bytes(bytes_domain));
            },
            _ => None,
        }
    }
}
