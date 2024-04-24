library;

use std::{ 
    hash::*,
    bytes::Bytes,
    string::String,
    storage::storage_key::*,
    call_frames::{ contract_id },
};
use src7::{ Metadata };
use asset::{ 
    mint::{ _mint },
    metadata::*,
};
use libraries::{ validations::assert_name_validity };

// TODO: Remove this abi when fix issue in fuels-ts with String decoder 
// Rewrite the `SRC20` ABI, remove `Option<String>` and use `String`.
abi SRC20 {
    #[storage(read)]
    fn total_assets() -> u64;

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64>;

    #[storage(read)]
    fn name(asset: AssetId) -> String;

    #[storage(read)]
    fn symbol(asset: AssetId) -> String;

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8>;
}

// TODO: Remove this abi when fix issue in fuels-ts with String decoder 
// Rewrite the `SRC7` ABI, remove `Option<Metadata>` and use the `Metadata` enum.
abi SRC7 {
    #[storage(read)]
    fn metadata(asset: AssetId, key: String) -> Option<Metadata>;

    #[storage(read)]
    fn image_url(name: String) -> String;
}

// Token name
pub fn _name() -> String {
    return String::from_ascii_str("Bako ID");
}

// Token symbol
pub fn _symbol() -> String {
    return String::from_ascii_str("BNFT");
}

// Token decimals
pub fn _decimals() -> u8 {
    return 0u8;
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
    AssetId::new(contract_id(), _sub_id(name))
}

// TODO: move to utils
fn concat_string(string1: String, string2: String) -> String {
    let mut new_string = Bytes::new();
    new_string.append(string1.as_bytes());
    new_string.append(string2.as_bytes());
    
    return String::from(new_string);
}