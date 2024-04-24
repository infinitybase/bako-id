library;

use std::{
    hash::*,
    string::String,
    context::msg_amount,
    contract_id::ContractId,
    constants::BASE_ASSET_ID,
    call_frames::{ msg_asset_id },
};
use libraries::{
    abis::{StorageContract},
    structures::{FuelDomain},
    validations::{assert_name_validity},
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
}

#[storage(read), payable]
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
    let domain = FuelDomain::new(owner, resolver);
    storage.set(domain_hash, domain.to_bytes());
    
    if (storage.reverse_get(resolver).is_empty()) {
        storage.reverse_set(resolver, name);
    }

    return name;
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