library;

use std::string::String;

pub struct RecordData {
    pub owner: Identity,
    pub resolver: Identity,
    pub period: u16,
    pub timestamp: u64,
}

abi Manager {
    #[storage(read, write)]
    fn set_record(name: String, data: RecordData);

    #[storage(read, write)]
    fn set_resolver(name: String, resolver: Identity);

    #[storage(read, write)]
    fn set_owner(name: String, owner: Identity);

    #[storage(read, write)]
    fn set_primary_handle(name: String);
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