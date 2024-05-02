library;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    context::msg_amount,
    contract_id::ContractId,
    constants::BASE_ASSET_ID,
    bytes_conversions::u16::*,
    call_frames::{ msg_asset_id },
};
use libraries::{
    abis::{StorageContract},
    structures::{BakoHandle},
    validations::{
        assert_name_validity,
    },
};

pub enum RegistryContractError {
    StorageNotInitialized: (),
    AlreadyInitialized: (),
    DomainNotAvailable: (),
    IncorrectAssetId: (),
    InvalidAmount: (),
}

abi RegistryContract {
    #[storage(read, write)]
    fn constructor(owner: Address, storage_id: ContractId);

    #[storage(read, write), payable]
    fn register(name: String, resolver: b256) -> AssetId;

    #[storage(read)]
    fn get_all(owner: b256) -> Bytes;
}

#[storage(read)]
pub fn _register(name: String, resolver: b256, bako_id: ContractId) -> String {
    require(
        msg_asset_id() == BASE_ASSET_ID,
        RegistryContractError::IncorrectAssetId,
    );

    let name = assert_name_validity(name);
    let domain_hash = sha256(name);

    // Check domain is available
    let storage = abi(StorageContract, bako_id.into());

    let domain_available = storage.get(domain_hash).is_none();
    require(domain_available, RegistryContractError::DomainNotAvailable);

    // TODO: change to receive the period, the default now is 1 year
    let domain_price = domain_price(name, 1);
    require(msg_amount() == domain_price, RegistryContractError::InvalidAmount);

    let owner = msg_sender().unwrap().as_address().unwrap().value;
    let is_primary = storage.get_primary(resolver).is_none();
    let domain = BakoHandle::new(
        name, 
        owner, 
        resolver,
        is_primary,
    );
    storage.set(domain_hash, owner, domain.into());
    
    if (storage.get_primary(resolver).is_none()) {
        storage.set_primary(resolver, name);
    }

    return name;
}

#[storage(read)]
pub fn _get_all(owner: b256, bako_id: ContractId) -> Bytes {
    let storage = abi(StorageContract, bako_id.into());

    let vec = storage.get_all(owner);
    let mut vec_bytes = Bytes::new();

    let mut i = 0;
    while i < vec.len() {
        let handle_bytes = vec.get(i).unwrap();
        let handle = BakoHandle::from(handle_bytes);
        vec_bytes.append(handle.name.as_bytes().len().try_as_u16().unwrap().to_be_bytes());
        vec_bytes.append(handle.name.as_bytes());
        vec_bytes.push(0u8);
        vec_bytes.push(1u8);
        vec_bytes.push(match handle.primary { true => 1u8, false => 0u8, });
        i += 1;
    }

    return vec_bytes;
}

pub fn domain_price(domain: String, period: u64) -> u64 {
    let domain_len = domain.as_bytes().len;
    let mut amount = match domain_len {
        3 => 5_000,
        4 => 1_000,
        _ => 200,
    };

    amount = amount * 1000;

    return amount * period;
}