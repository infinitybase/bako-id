script;

use std::string::String;
use std::logging::log;
use std::hash::*;
use std::bytes::Bytes;
use std::auth::caller_address;
use standards::src7::Metadata;

enum UploaderValidatorScriptError {
    ContractAddressNotSet: (),
    FileHashNotSet: (),
    HandleNotSet: (),
    HandleNotFound: (),
    NotOwner: (),
}
abi Registry {
    #[storage(write, read), payable]
    fn register(name: String, resolver: Identity, period: u16);
    #[storage(write, read)]
    fn set_metadata_info(name: String, key: String, value: Metadata);
    #[storage(write, read)]
    fn set_owner(name: String, owner: Identity);
    #[storage(write, read)]
    fn set_resolver(name: String, resolver: Identity);
}
struct UploadEvent {
    file_hash: b256,
    handle: String,
    sender: Address,
    owner: Identity,
}
pub struct RecordData {
    pub owner: Identity,
    pub resolver: Identity,
    pub period: u16,
    pub timestamp: u64,
}
abi ManagerInfo {
    #[storage(read)]
    fn get_record(name: String) -> Option<RecordData>;
    #[storage(read)]
    fn get_resolver(name: String) -> Option<Identity>;
    #[storage(read)]
    fn get_owner(name: String) -> Option<Identity>;
    #[storage(read)]
    fn get_name(resolver: Identity) -> Option<String>;
}
configurable {
    MANAGER_ADDRESS: b256 = b256::zero(),
    REGISTRY_ADDRESS: b256 = b256::zero(),
}

pub fn concat_string(string1: String, string2: String) -> String {
    let mut new_string = Bytes::new();
    new_string.append(string1.as_bytes());
    new_string.append(string2.as_bytes());

    return String::from(new_string);
}

fn main(file_hash: b256, handle: String, base_url: String) {
    require(
        !MANAGER_ADDRESS
            .is_zero(),
        UploaderValidatorScriptError::ContractAddressNotSet,
    );
    require(
        file_hash != b256::zero(),
        UploaderValidatorScriptError::FileHashNotSet,
    );
    require(
        !handle
            .is_empty(),
        UploaderValidatorScriptError::HandleNotSet,
    );
    let sender = caller_address().unwrap();
    let manager_info = abi(ManagerInfo, MANAGER_ADDRESS);
    let owner = manager_info.get_owner(handle);
    require(
        owner
            .is_some(),
        UploaderValidatorScriptError::HandleNotFound,
    );
    let owner = owner.unwrap();

    require(
        owner
            .bits() == sender
            .bits(),
        UploaderValidatorScriptError::NotOwner,
    );

    let avatar_url = concat_string(base_url, handle);

    let registry = abi(Registry, REGISTRY_ADDRESS);

    registry.set_metadata_info(
        handle,
        String::from_ascii_str("avatar:hash"),
        Metadata::B256(file_hash),
    );

    registry.set_metadata_info(
        handle,
        String::from_ascii_str("avatar"),
        Metadata::String(avatar_url),
    );

    log(UploadEvent {
        file_hash: file_hash,
        handle: handle,
        sender: sender,
        owner: owner,
    });
}
