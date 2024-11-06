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
use std::context::msg_amount;
use standards::src3::SRC3;
use standards::src7::{Metadata};
use sway_libs::asset::metadata::*;
use lib::abis::manager::{Manager, ManagerInfo, RecordData};
use lib::validations::{assert_name_validity};
use lib::string::{concat_string};
use events::{NewNameEvent};
use abis::{Registry, Constructor};
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
    let asset_id = AssetId::new(ContractId::this(), sub_id);
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

    asset_id
}

enum RegistryContractError {
    IncorrectAssetId: (),
    InvalidAmount: (),
    AlreadyMinted: (),
    AlreadyInitialized: (),
    ContractNotBeZero: (),
    ContractNotInitialized: (),
}

impl Registry for Contract {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16) {
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
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId, token_id: ContractId) {
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