contract;

use std::string::String;
use std::hash::{sha256, Hash};
use standards::src7::{SRC7, Metadata};
use lib::abis::manager::{ManagerInfo};
use lib::abis::resolver::{Constructor, AddressResolver, NameResolver};

storage {
    manager_id: ContractId = ContractId::zero(), 
}

#[storage(read)]
fn get_manager_id() -> ContractId {
    let manager_id = storage.manager_id.read();
    require(manager_id != ContractId::zero(), "Manager ID not set.");
    manager_id
}

impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(manager_id: ContractId) {
        let manager = storage.manager_id.read();
        require(manager == ContractId::zero(), "Contract already initialized");
        storage.manager_id.write(manager_id);
    }
}

impl AddressResolver for Contract {
    #[storage(read)]
    fn addr(name: String) -> Option<Identity> {
        let manager_id = get_manager_id();
        let manager = abi(ManagerInfo, manager_id.into());
        manager.get_resolver(name)
    }

    #[storage(read)]
    fn owner(name: String) -> Option<Identity> {
        let manager_id = get_manager_id();
        let manager = abi(ManagerInfo, manager_id.into());
        manager.get_owner(name)
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