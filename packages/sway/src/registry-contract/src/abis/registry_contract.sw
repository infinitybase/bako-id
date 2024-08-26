library;

use std::{
    block::timestamp,
    bytes::Bytes,
    bytes_conversions::u16::*,
    call_frames::msg_asset_id,
    context::msg_amount,
    contract_id::ContractId,
    hash::*,
    string::String,
};
use libraries::{
    abis::StorageContract,
    structures::BakoHandle,
    validations::{
        assert_name_validity,
    },
};
pub enum RegistryContractError {
    StorageNotInitialized: (),
    AlreadyInitialized: (),
    DomainNotAvailable: (),
    IncorrectAssetId: (),
    InvalidDomain: (),
    InvalidAmount: (),
    InvalidPermission: (),
    NotOwner: (),
    SameResolver: (),
    AlreadyPrimary: (),
}
abi RegistryContract {
    #[storage(read, write)]
    fn constructor(
        owner: Address,
        storage_id: ContractId,
        attestation_id: ContractId,
    );
    #[storage(read, write), payable]
    fn register(input: RegisterInput) -> AssetId;

    #[storage(read, write)]
    fn edit_resolver(name: String, resolver: b256);
    #[storage(read, write)]
    fn set_primary_handle(name: String);
}
pub struct RegisterInput {
    pub name: String,
    pub resolver: b256,
    pub period: u16,
    pub attestation_key: Option<b256>,
}
pub struct EditResolverInput {
    pub name: String,
    pub resolver: b256,
}
pub struct SetPrimaryHandleInput {
    pub name: String,
}
pub fn msg_sender_address() -> b256 {
    match msg_sender().unwrap() {
        Identity::Address(address) => address.bits(),
        _ => revert(0),
    }
}
#[storage(read)]
pub fn _register(input: RegisterInput, bako_id: ContractId) -> String {
    require(
        msg_asset_id() == AssetId::base(),
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
        require(
            !handle
                .is_expired(),
            RegistryContractError::DomainNotAvailable,
        );
    }
    let domain_available = storage.get(domain_hash).is_none();
    require(domain_available, RegistryContractError::DomainNotAvailable);
    // TODO: change to receive the period, the default now is 1 year
    let domain_price = domain_price(name, input.period);
    require(
        msg_amount() == domain_price,
        RegistryContractError::InvalidAmount,
    );
    let owner: b256 = msg_sender().unwrap().as_address().unwrap().into();
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
#[storage(read, write)]
pub fn _edit_resolver(input: EditResolverInput, bako_id: ContractId) {
    let domain_hash = sha256(input.name);
    let storage_contract = abi(StorageContract, bako_id.into());
    let handle_bytes = storage_contract.get(domain_hash);
    require(handle_bytes.is_some(), RegistryContractError::InvalidDomain);
    let mut domain = BakoHandle::from(handle_bytes.unwrap());
    require(
        Identity::Address(Address::from(domain.owner)) == msg_sender()
            .unwrap(),
        RegistryContractError::NotOwner,
    );
    require(
        domain
            .resolver != input.resolver,
        RegistryContractError::SameResolver,
    );
    domain.resolver = input.resolver;
    storage_contract.change(domain_hash, domain.into());
}
#[storage(read, write)]
pub fn _set_primary_handle(params: SetPrimaryHandleInput, bako_id: ContractId) {
    let domain_hash = sha256(params.name);
    let caller = msg_sender_address();
    let storage = abi(StorageContract, bako_id.into());
    let domain = storage.get(domain_hash);
    require(domain.is_some(), RegistryContractError::InvalidDomain);
    let mut handle = BakoHandle::from(domain.unwrap());
    require(
        Identity::Address(Address::from(handle.owner)) == msg_sender()
            .unwrap(),
        RegistryContractError::NotOwner,
    );
    require(!handle.primary, RegistryContractError::AlreadyPrimary);
    let previous_primary_handle = storage.get_primary(caller);
    if let Some(previous_handle_name) = previous_primary_handle
    {
        let mut previous_handle = BakoHandle::from(previous_handle_name);
        previous_handle.primary = false;

        storage.change(sha256(previous_handle.name), previous_handle.into());
    }
    handle.primary = true;

    storage.set_primary(caller, params.name);
    storage.change(domain_hash, handle.into());
}
pub fn domain_price(domain: String, period: u16) -> u64 {
    let domain_len = domain.as_bytes().len();
    let mut amount = match domain_len {
        3 => 5_000,
        4 => 1_000,
        _ => 200,
    };
    amount = amount * 1000;

    return amount * period.as_u64();
}
