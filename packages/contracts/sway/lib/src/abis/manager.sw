library;

use std::string::String;

pub struct RecordData {
    pub ttl: u64,
    pub owner: Identity,
    pub resolver: Identity,
}

abi Manager {
    #[storage(read, write)]
    fn register(name: String, data: RecordData);

    #[storage(read, write)]
    fn set_resolver(name: String, resolver: Identity);
}

abi ManagerInfo {
    #[storage(read)]
    fn get_record(name: String) -> Option<RecordData>;

    #[storage(read)]
    fn get_resolver(name: String) -> Option<Identity>;

    #[storage(read)]
    fn get_owner(name: String) -> Option<Identity>;

    #[storage(read)]
    fn get_ttl(name: String) -> Option<u64>;

    #[storage(read)]
    fn get_name(resolver: Identity) -> Option<String>;
}