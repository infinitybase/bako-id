library;

use std::{ 
    hash::*,
    bytes::Bytes,
    string::String,
    storage::storage_key::*,
};
use standards::{
    src7::{Metadata}
};
use sway_libs::{
    asset::{
        metadata::*,
        supply::{
            _burn,
            _mint,
        },
    },
};
use libraries::{ validations::assert_name_validity };

// Token name
pub fn _name() -> Option<String> {
    return Option::Some(String::from_ascii_str("Bako ID"));
}

// Token symbol
pub fn _symbol() -> Option<String> {
    return Option::Some(String::from_ascii_str("BNFT"));
}

// Token decimals
pub fn _decimals() -> Option<u8> {
    return Option::Some(0u8);
}

abi NFTContract {
    #[storage(read)]
    fn image_url(name: String) -> String;
}

// Get image of asset
#[storage(read)]
pub fn _image_url(metadatas: StorageKey<StorageMetadata>, name: String) -> String {
    let name = assert_name_validity(name);
    let image_url_metadata = metadatas.get(
        _asset_id(name), 
        String::from_ascii_str("image_url"),
    ).unwrap_or(Metadata::String(String::from_ascii_str("")));
    return image_url_metadata.as_string().unwrap_or(String::new());
}

#[storage(read, write)]
pub fn _mint_bako_nft(
    total_assets_key: StorageKey<u64>,
    total_supply_key: StorageKey<StorageMap<AssetId, u64>>,
    metadatas: StorageKey<StorageMetadata>,
    name: String
) -> AssetId {
    let asset_id = _mint(
        total_assets_key, 
        total_supply_key, 
        msg_sender().unwrap(), 
        _sub_id(name), 
        1
    );
    metadatas.insert(
        asset_id, 
        String::from_ascii_str("image_url"), 
        Metadata::String(
            concat_string(
                String::from_ascii_str("https://assets.bako.id/"),
                name
            )
        )
    );

    return asset_id;
}

fn _sub_id(name: String) -> b256 {
    sha256(name)
}

fn _asset_id(name: String) -> AssetId {
    AssetId::new(ContractId::this(), _sub_id(name))
}

// TODO: move to utils
fn concat_string(string1: String, string2: String) -> String {
    let mut new_string = Bytes::new();
    new_string.append(string1.as_bytes());
    new_string.append(string2.as_bytes());
    
    return String::from(new_string);
}