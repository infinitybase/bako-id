contract;

mod abis;
mod events;

use abis::{info_contract::*, nft_contract::*, registry_contract::*,};

use libraries::{
    permissions::{
        get_permission,
        OWNER,
        Permission,
        set_permission,
        with_permission,
    },
    abis::{ Attestation }
};

use events::{HandleMintedEvent, NewResolverEvent,};

use standards::{src20::*, src7::*};
use sway_libs::{
    asset::{
        base::{
            _total_assets,
            _total_supply,
            SetAssetAttributes,
        },
        metadata::*,
        supply::{
            _burn,
            _mint,
        },
    },
};

use std::{
    bytes::Bytes,
    contract_id::ContractId,
    hash::*,
    storage::storage_bytes::*,
    storage::storage_map::*,
    string::String,
};

storage {
    // Flow control
    storage_id: Option<ContractId> = Option::None,
    attestation_id: Option<ContractId> = Option::None,
    initialized: bool = false,
    // NFT
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    metadata: StorageMetadata = StorageMetadata {},
}

#[storage(read)]
fn get_storage_id() -> ContractId {
    let storage_id = storage.storage_id.read();
    require(
        storage_id
            .is_some(),
        RegistryContractError::StorageNotInitialized,
    );
    storage_id.unwrap()
}

impl RegistryContract for Contract {
    #[storage(read, write)]
    fn constructor(
        owner: Address,
        storage_id: ContractId,
        attestation_id: ContractId,
    ) {
        // Check storage already intialized
        let initalized = storage.initialized.read();
        require(!initalized, RegistryContractError::AlreadyInitialized);
        storage.initialized.write(true);

        // Set owner address in storage
        set_permission(OWNER, Identity::Address(owner));
        storage.storage_id.write(Option::Some(storage_id));

        // Set attestation contract id in storage
        storage.attestation_id.write(Option::Some(attestation_id));
    }

    #[storage(read, write), payable]
    fn register(input: RegisterInput) -> AssetId {
        // TODO: Add reantry guard
        let name = _register(
            RegisterInput {
                name: input.name,
                resolver: input.resolver,
                period: input.period,
                attestation_key: input.attestation_key,
            },
            get_storage_id(),
        );
    
        let asset_id = _mint_bako_nft(
            storage
                .total_assets,
            storage
                .total_supply,
            storage
                .metadata,
            name,
        );
        
        match input.attestation_key {
            Some(attestation_key) => {
                let attestation_id = storage.attestation_id.read().unwrap();
                let attestation_contract = abi(Attestation, attestation_id.into());
    
                let attestation_hash = attestation_contract.verify(attestation_key);
    
                match attestation_hash {
                    Some(attestation_hash) => {
                        storage.metadata.insert(
                            asset_id,
                            String::from_ascii_str("attestation_hash"),
                            Metadata::B256(attestation_hash),
                        );
                    }
                    None => {}
                }
                
            }
            None => {}  
            
                
        };
    
        log(HandleMintedEvent {
            domain_hash: sha256(name),
            owner: msg_sender().unwrap(),
            resolver: input.resolver,
            asset: asset_id,
        });
    
    
        return asset_id;
    }

    #[storage(read, write)]
    fn edit_resolver(name: String, resolver: b256) {
        _edit_resolver(EditResolverInput { name, resolver }, get_storage_id());

        log(NewResolverEvent {
            domain_hash: sha256(name),
            resolver,
        });
    }

    #[storage(read, write)]
    fn set_primary_handle(name: String) {
        _set_primary_handle(SetPrimaryHandleInput { name }, get_storage_id());
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
        _name()
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        _symbol()
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        _decimals()
    }
}

impl SRC7 for Contract {
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata> {
        storage.metadata.get(asset, key)
    }
}

impl InfoContract for Contract {
    #[storage(read)]
    fn get_all(owner: b256) -> Bytes {
        _get_all(owner, get_storage_id())
    }

    #[storage(read)]
    fn get_grace_period(owner: String) -> GracePeriod {
        _get_grace_period(owner, get_storage_id())
    }
}
