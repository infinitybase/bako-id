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
use standards::src20::{SRC20};
use standards::src7::{SRC7, Metadata};
use sway_libs::asset::supply::_mint;
use sway_libs::asset::metadata::*;
use sway_libs::asset::base::{_total_assets,_total_supply};
use lib::abis::manager::{Manager, ManagerInfo, RecordData};
use lib::validations::{assert_name_validity};
use lib::string::{concat_string};
use events::{NewNameEvent};
use abis::{Registry, Constructor};
use lib::{domain_price};

configurable {
    /// The decimals of the asset minted by this contract.
    DECIMALS: u8 = 0u8,
    /// The name of the asset minted by this contract.
    NAME: str[7] = __to_str_array("Bako ID"),
    /// The symbol of the asset minted by this contract.
    SYMBOL: str[4] = __to_str_array("BKID"),
}

storage {
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    metadata: StorageMetadata = StorageMetadata {},
    manager_id: ContractId = ContractId::zero(),
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
    let total_supply = _total_supply(
        storage.total_supply,
        AssetId::new(ContractId::this(), sub_id)
    ).unwrap_or(0);

    require(total_supply == 0, "Asset already minted.");

    let asset_id = _mint(
        storage.total_assets, 
        storage.total_supply, 
        receiver, 
        sub_id, 
        1
    );

    storage.metadata.insert(
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
    fn constructor(manager_id: ContractId) {
        require(manager_id != ContractId::zero(), RegistryContractError::ContractNotBeZero);

        let contract_id = storage.manager_id.read();
        require(contract_id == ContractId::zero(), RegistryContractError::AlreadyInitialized);

        storage.manager_id.write(manager_id);
    }
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        _total_assets(storage.total_assets)
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        _total_supply(storage.total_supply, asset)
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        match storage.total_supply.get(asset).try_read() {
            Some(_) => Some(String::from_ascii_str(from_str_array(NAME))),
            None => None,
        }
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        match storage.total_supply.get(asset).try_read() {
            Some(_) => Some(String::from_ascii_str(from_str_array(SYMBOL))),
            None => None,
        }
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        match storage.total_supply.get(asset).try_read() {
            Some(_) => Some(DECIMALS),
            None => None,
        }
    }
}

impl SRC7 for Contract {
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata> {
        storage.metadata.get(asset, key)
    }
}