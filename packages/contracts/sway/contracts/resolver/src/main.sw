contract;

use std::string::String;
use std::hash::{sha256, Hash};
use standards::src7::{SRC7, Metadata};
use lib::abis::manager::{ManagerInfo};
use lib::abis::resolver::{Constructor, AddressResolver, NameResolver, MetadataResolver};

storage {
    manager_id: ContractId = ContractId::zero(), 
    metadata_id: ContractId = ContractId::zero(),
}

#[storage(read)]
fn get_manager_id() -> ContractId {
    let manager_id = storage.manager_id.read();
    require(manager_id != ContractId::zero(), "Manager ID not set.");
    manager_id
}

#[storage(read)]
fn get_metadata_id() -> ContractId {
    let metadata_id = storage.metadata_id.read();
    require(metadata_id != ContractId::zero(), "Metadata ID not set.");
    metadata_id
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId, metadata_id: ContractId) {
        let manager = storage.manager_id.read();
        let metadata = storage.metadata_id.read();

        require(manager == ContractId::zero(), "Contract already initialized");
        require(metadata == ContractId::zero(), "Contract already initialized");

        storage.manager_id.write(manager_id);
        storage.metadata_id.write(metadata_id);
    }
}

impl AddressResolver for Contract {
    #[storage(read)]
    fn addr(name: String) -> Option<Identity> {
        let manager_id = get_manager_id();
        let manager = abi(ManagerInfo, manager_id.into());
        manager.get_resolver(name)
    }
}

impl NameResolver for Contract {
    #[storage(read)]
    fn name(addr: Identity) -> Option<String> {
        let manager_id = get_manager_id();
        let manager = abi(ManagerInfo, manager_id.into());
        manager.get_name(addr)
    }
}

impl MetadataResolver for Contract {
    #[storage(read)]
    fn metadata(name: String, key: String) -> Option<Metadata> {
        let metadata_id = get_metadata_id();
        let metadata = abi(SRC7, metadata_id.into());
        let asset_id = AssetId::new(metadata_id, sha256(name));
        metadata.metadata(asset_id, key)
    }
}
