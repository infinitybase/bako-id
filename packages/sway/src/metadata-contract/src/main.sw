contract;

mod storage_metadata;

use ::storage_metadata::*;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    bytes_conversions::u16::*,
    primitive_conversions::u64::*,
};
use libraries::{
    abis::{StorageContract},
    structures::{BakoHandle},
    permissions::{
        Permission,
        OWNER,
        with_permission,
        set_permission,
        get_permission,
    },
};

enum MetadataContractError {
    StorageNotInitialized: (),
    AlreadyInitialized: (),
    InvalidPermission: (),
    InvalidDomain: (),
}

abi MetadataContract {
    #[storage(read, write)]
    fn constructor(storage_id: ContractId);

    #[storage(read, write)]
    fn save(handle_name: String, key: String, value: String);

    #[storage(read)]
    fn get(handle_name: String, key: String) -> String;

    #[storage(read)]
    fn get_all(handle_name: String) -> Bytes;
}

storage {
    metadata: StorageMetadata = StorageMetadata {},
    storage_id: Option<ContractId> = Option::None,
    initialized: bool = false,
}

impl MetadataContract for Contract {
    #[storage(read, write)]
    fn constructor(storage_id: ContractId) {
        // Check storage already intialized
        let initalized = storage.initialized.read();
        require(!initalized, MetadataContractError::AlreadyInitialized);
        storage.initialized.write(true);
        storage.storage_id.write(Option::Some(storage_id));
    }


    #[storage(read, write)]
    fn save(handle_name: String, key: String, value: String) {
        let storage_id = get_storage_id();
        // TODO: Add reentrancy protection
        storage.metadata.insert(sha256(handle_name), key, value);
        let storage_contract = abi(StorageContract, storage_id.into());
        let handle_bytes = storage_contract.get(sha256(handle_name));

        require(handle_bytes.is_some(), MetadataContractError::InvalidDomain);

        let domain = BakoHandle::from(handle_bytes.unwrap());
        let is_owner = Identity::Address(Address::from(domain.owner)) == msg_sender().unwrap();

        require(is_owner, MetadataContractError::InvalidPermission);
    }

    #[storage(read)]
    fn get(handle_name: String, key: String) -> String {
        return storage.metadata.get(sha256(handle_name), key);
    }

    #[storage(read)]
    fn get_all(handle_name: String) -> Bytes {
        let user_metadata_list = storage.metadata.get_all(sha256(handle_name));
        return vec_metadata_to_bytes(user_metadata_list);
    }
}

fn vec_metadata_to_bytes(metadata_vec: Vec<String>) -> Bytes {
    let mut metadata_bytes = Bytes::new();

    let mut i = 0;
    while i < metadata_vec.len() {
        let metadata_key = metadata_vec.get(i).unwrap();
        let metadata_value = metadata_vec.get(i + 1).unwrap();

        let key_bytes = metadata_key.as_bytes();
        let value_bytes = metadata_value.as_bytes();
        
        metadata_bytes.append(key_bytes.len().try_as_u16().unwrap().to_be_bytes());
        metadata_bytes.append(key_bytes);
        metadata_bytes.append(value_bytes.len().try_as_u16().unwrap().to_be_bytes());
        metadata_bytes.append(value_bytes);

        i += 2;
    }


    return metadata_bytes;
}

#[storage(read)]
fn get_storage_id() -> ContractId {
    let storage_id = storage.storage_id.read();
    require(storage_id.is_some(), MetadataContractError::StorageNotInitialized);
    return storage_id.unwrap();
}