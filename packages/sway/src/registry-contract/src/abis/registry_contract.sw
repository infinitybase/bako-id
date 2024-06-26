library;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    context::msg_amount,
    block::timestamp,
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
    fn register(name: String, resolver: b256, period: u16) -> AssetId;
}




pub struct RegisterInput {
    name: String,
    resolver: b256,
    period: u16,
}

#[storage(read)]
pub fn _register(input: RegisterInput, bako_id: ContractId) -> String {
    require(
        msg_asset_id() == BASE_ASSET_ID,
        RegistryContractError::IncorrectAssetId,
    );

    let name = assert_name_validity(input.name);
    let domain_hash = sha256(name);
    let current_timestamp = timestamp();
    let resolver = input.resolver;

    // Check domain is available
    let storage = abi(StorageContract, bako_id.into());


    let domain = storage.get(domain_hash);
    if (domain.is_some()) {
        let handle = BakoHandle::from(domain.unwrap());
        require(!handle.is_expired(), RegistryContractError::DomainNotAvailable); 
    }


    let domain_available = storage.get(domain_hash).is_none();
    require(domain_available, RegistryContractError::DomainNotAvailable);

    // TODO: change to receive the period, the default now is 1 year
    let domain_price = domain_price(name, input.period);   
    require(msg_amount() == domain_price, RegistryContractError::InvalidAmount);


    let owner = msg_sender().unwrap().as_address().unwrap().value;
    let is_primary = storage.get_primary(resolver).is_none();
    let domain = BakoHandle::new(
        name, 
        owner, 
        resolver,
        is_primary,
        current_timestamp,
        input.period,

    );
    storage.set(domain_hash, owner, domain.into());
    
    if (storage.get_primary(resolver).is_none()) {
        storage.set_primary(resolver, name);
    }

    return name;
}


pub fn domain_price(domain: String, period: u16) -> u64 {
    let domain_len = domain.as_bytes().len;
    let mut amount = match domain_len {
        3 => 5_000,
        4 => 1_000,
        _ => 200,
    };

    amount = amount * 1000;

    return amount * period.as_u64();
}