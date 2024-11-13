contract;

use std::storage::*;
use std::string::String;
use std::block::timestamp;
use std::hash::{Hash, sha256};
use std::storage::storage_string::{*, StorageString};
use std::call_frames::msg_asset_id;
use std::context::msg_amount;
use standards::src20::{SRC20, TotalSupplyEvent};
use standards::src7::{SRC7, Metadata};
use standards::src3::SRC3;
use standards::src5::{SRC5, State};
use sway_libs::asset::supply::{_burn, _mint};
use sway_libs::asset::metadata::*;
use sway_libs::asset::base::{_total_assets,_total_supply, _set_name, _name, SetAssetAttributes};
use sway_libs::{admin::*, ownership::*};

pub enum MintError {
    CannotMintMoreThanOneNFTWithSubId: (),
    MaxNFTsMinted: (),
    NFTAlreadyMinted: (),
}

pub enum SetError {
    ValueAlreadySet: (),
}

configurable {
    /// The decimals of the asset minted by this contract.
    DECIMALS: u8 = 0u8,
    /// The symbol of the asset minted by this contract.
    SYMBOL: str[3] = __to_str_array("BID"),
}

storage {
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    metadata: StorageMetadata = StorageMetadata {},
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity, admin: Identity);
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Identity, admin: Identity) {
        initialize_ownership(owner);
        add_admin(admin);
    }
}

abi Admin {
    #[storage(read, write)]
    fn revoke_admin(admin: Identity);
    
    #[storage(read, write)]
    fn add_admin(admin: Identity);

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity);
}

impl Admin for Contract {
    #[storage(read, write)]
    fn revoke_admin(admin: Identity) {
        only_owner();
        revoke_admin(admin);
    }

    #[storage(read, write)]
    fn add_admin(admin: Identity) {
        only_owner();
        add_admin(admin);
    }

    #[storage(read, write)]
    fn transfer_ownership(new_owner: Identity) {
        only_owner();
        transfer_ownership(new_owner);
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
        _name(storage.name, asset)
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

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        only_admin();
        require(sub_id.is_some(), MintError::CannotMintMoreThanOneNFTWithSubId);
        // Checks to ensure this is a valid mint.
        let asset = AssetId::new(ContractId::this(), sub_id.unwrap());
        require(amount == 1, MintError::CannotMintMoreThanOneNFTWithSubId);
        require(
            storage
                .total_supply
                .get(asset)
                .try_read()
                .is_none(),
            MintError::NFTAlreadyMinted,
        );

        // Mint the NFT
        let _ = _mint(
            storage
                .total_assets,
            storage
                .total_supply,
            recipient,
            sub_id.unwrap(),
            amount,
        );
    }
 
    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        only_admin();
        _burn(storage.total_supply, sub_id, amount);
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

impl SetAssetAttributes for Contract {
    #[storage(write)]
    fn set_name(asset: AssetId, name: String) {
        only_admin();
        require(
            storage
                .name
                .get(asset)
                .read_slice()
                .is_none(),
            SetError::ValueAlreadySet,
        );
        _set_name(storage.name, asset, name);
    }

    #[storage(write)]
    fn set_symbol(asset: AssetId, symbol: String) {
        require(false, SetError::ValueAlreadySet);
    }

    #[storage(write)]
    fn set_decimals(_asset: AssetId, _decimals: u8) {
        require(false, SetError::ValueAlreadySet);
    }
}


impl SetAssetMetadata for Contract {
    #[storage(read, write)]
    fn set_metadata(asset: AssetId, key: String, metadata: Metadata) {
        only_admin();
        _set_metadata(storage.metadata, asset, key, metadata);
    }
}