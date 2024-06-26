contract;

mod abis;

use abis::{
    nft_contract::*,
    registry_contract::*,
};
use libraries::{
    permissions::{
        Permission,
        OWNER,
        with_permission,
        set_permission,
        get_permission,
    },
};
use asset::{ 
    base::{
        _total_assets,
        _total_supply,
    },
    metadata::*,
};
use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    contract_id::ContractId,
    storage::storage_map::*,
};
use src7::{ Metadata };

storage {
    // Flow control
    storage_id: Option<ContractId> = Option::None,
    initialized: bool = false,

    // NFT
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    metadata: StorageMetadata = StorageMetadata {},
}

#[storage(read)]
fn get_storage_id() -> ContractId {
    let storage_id = storage.storage_id.read();
    require(storage_id.is_some(), RegistryContractError::StorageNotInitialized);
    storage_id.unwrap()
}

impl RegistryContract for Contract {
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

    #[storage(read, write), payable]
    fn register(name: String, resolver: b256) -> AssetId {
        // TODO: Add reantry guard
        let name = _register(
            name, 
            resolver, 
            get_storage_id()
        );
        return _mint_bako_nft(
            storage.total_assets,
            storage.total_supply,
            storage.metadata,
            name,
        );
    }

    #[storage(read)]
    fn get_all(owner: b256) -> Bytes {
        _get_all(owner, get_storage_id())
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
    fn name(asset: AssetId) -> String {
        _name()
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> String {
        _symbol()
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        Some(_decimals())
    }
}

impl SRC7 for Contract {
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata> {
        storage.metadata.get(asset, key)
    }

    #[storage(read)]
    fn image_url(name: String) -> String {
        _image_url(storage.metadata, name)
    }
}