contract;

mod events;
mod abis;
mod lib;

use std::storage::*;
use std::string::String;
use std::block::timestamp;
use std::hash::{Hash, sha256};
use std::storage::storage_string::{*, StorageString};
use std::call_frames::msg_asset_id;
use std::context::{msg_amount, this_balance};
use standards::src3::SRC3;
use std::asset::transfer;
use standards::src7::{Metadata};
use sway_libs::pausable::{_is_paused, _pause, _unpause, Pausable, require_not_paused};
use sway_libs::asset::metadata::*;
use sway_libs::asset::base::SetAssetAttributes;
use sway_libs::ownership::*;
use standards::src5::{SRC5, State};
use lib::abis::manager::{Manager, ManagerInfo, RecordData};
use lib::validations::{assert_name_validity};
use lib::string::{concat_string};
use events::{NewNameEvent};
use abis::{Registry, Constructor, Ownership, RegistryInfo};
use lib::{domain_price};

storage {
    manager_id: ContractId = ContractId::zero(),
    token_id: ContractId = ContractId::zero(),
}

#[storage(read)]
fn get_manager_id() -> ContractId {
    let manager_id = storage.manager_id.read();
    require(manager_id != ContractId::zero(), RegistryContractError::ContractNotInitialized);
    manager_id
}

#[storage(read, write)]
fn mint_token(name: String, receiver: Identity) -> AssetId {
    let sub_id = sha256(name);
    let token_id = storage.token_id.read();
    let asset_id = AssetId::new(token_id, sub_id);
    let src3_contract = abi(SRC3, token_id.into());
    src3_contract.mint(receiver, Some(sub_id), 1);

    let nft_contract = abi(SetAssetMetadata, token_id.into());
    nft_contract.set_metadata(
        asset_id, 
        String::from_ascii_str("image:png"), 
        Metadata::String(
            concat_string(
                String::from_ascii_str("https://assets.bako.id/"),
                name
            )
        )
    );

    let nft_contract = abi(SetAssetAttributes, token_id.into());
    nft_contract.set_name(asset_id, concat_string(String::from_ascii_str("@"), name));

    asset_id
}

enum RegistryContractError {
    IncorrectAssetId: (),
    InvalidAmount: (),
    AlreadyMinted: (),
    AlreadyInitialized: (),
    ContractNotBeZero: (),
    ContractNotInitialized: (),
    NotOwner: (),
    NotFoundName: (),
}

impl Registry for Contract {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16) {
        require_not_paused();

        require(
            msg_asset_id() == AssetId::base(),
            RegistryContractError::IncorrectAssetId,
        );     

        let name = assert_name_validity(name);
        let manager_id = get_manager_id();
        let manager = abi(ManagerInfo, manager_id.into());

        require(
            manager.get_record(name).is_none(),
            RegistryContractError::AlreadyMinted,
        );

        let owner = msg_sender().unwrap();
        let name_hash = sha256(name);

        log(msg_amount());
        log(domain_price(name, period));

        require(
            msg_amount() == domain_price(name, period),
            RegistryContractError::InvalidAmount,
        );

        let asset_id = mint_token(name, owner);
        let manager = abi(Manager, manager_id.into());
        manager.set_record(name, RecordData {
            owner,
            period,
            resolver,
            timestamp: timestamp(),
        });

        log(NewNameEvent {
            name,
            owner,
            resolver,
            asset_id,
            name_hash,
        });
    }
    
    #[storage(write, read)]
    fn set_metadata_info(name: String, key: String, value: Metadata) {
        let manager_id = get_manager_id();
        let manager_contract = abi(ManagerInfo, manager_id.into());
        let register = manager_contract.get_record(name);
        
        require(
            register.is_some(),
            RegistryContractError::NotFoundName,
        );

        require(
            register.unwrap().owner == msg_sender().unwrap(),
            RegistryContractError::NotOwner,
        );

        let token_id = storage.token_id.read();
        let asset_id = AssetId::new(token_id, sha256(name));

        let nft_contract = abi(SetAssetMetadata, token_id.into());
        nft_contract.set_metadata(asset_id, key, value);
    }
}

impl RegistryInfo for Contract {
    #[storage(read)]
    fn ttl(name: String) -> Option<u64> {
        let manager_id = get_manager_id();
        let manager_contract = abi(ManagerInfo, manager_id.into());
        let register = manager_contract.get_record(name);

        match register {
            None => None,
            Some(record) => {
                let period = record.period.as_u64();
                let year_in_seconds: u64 = 365 * 24 * 3600;
                let timestamp = record.timestamp;
                let ttl = timestamp + (period * year_in_seconds);
                Some(ttl)
            },
        }
    }

    #[storage(read)]
    fn timestamp(name: String) -> Option<u64> {
        let manager_id = get_manager_id();
        let manager_contract = abi(ManagerInfo, manager_id.into());
        let register = manager_contract.get_record(name);
        
        match register {
            None => None,
            Some(record) => Some(record.timestamp),
        }
    }
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Address, manager_id: ContractId, token_id: ContractId) {
        initialize_ownership(Identity::Address(owner));

        require(manager_id != ContractId::zero(), RegistryContractError::ContractNotBeZero);
        require(token_id != ContractId::zero(), RegistryContractError::ContractNotBeZero);

        let contract_id = storage.manager_id.read();
        require(contract_id == ContractId::zero(), RegistryContractError::AlreadyInitialized);

        let contract_id = storage.token_id.read();
        require(contract_id == ContractId::zero(), RegistryContractError::AlreadyInitialized);

        storage.manager_id.write(manager_id);
        storage.token_id.write(token_id);
    }
}

impl Ownership for Contract {
    #[storage(read, write)]
    fn transfer_ownership(new_owner: Address) {
        only_owner();
        transfer_ownership(Identity::Address(new_owner));
    }

    #[storage(read)]
    fn transfer_funds(amount: u64, asset_id: AssetId, recipien: Address) {
        only_owner();
        let total_balance = this_balance(asset_id);
        require(
            total_balance >= amount,
            RegistryContractError::InvalidAmount
        );
        transfer(
            Identity::Address(recipien),
            AssetId::base(),
            amount,
        );
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}
 
impl Pausable for Contract {
    #[storage(write)]
    fn pause() {
        only_owner();
        _pause();
    }
 
    #[storage(write)]
    fn unpause() {
        only_owner();
        _unpause();
    }
 
    #[storage(read)]
    fn is_paused() -> bool {
        _is_paused()
    }
}