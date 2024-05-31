contract;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    contract_id::ContractId,
    storage::storage_map::*,
    storage::storage_bytes::*,
};

use libraries::{
    structures::{BakoHandle},
};

enum RegistryTestContractError {
    DomainUnavailable: (),
    DomainExpired: (),
}

storage {
  domains: StorageMap<b256, StorageBytes> = StorageMap {}
}

fn msgsender_address() -> Address {
    match std::auth::msg_sender().unwrap() {
        Identity::Address(identity) => identity,
        _ => revert(0),
    }
}

fn domain_price(domain: String, period: u16) -> u64 {
    let domain_len = domain.as_bytes().len;
    let mut amount = match domain_len {
        3 => 5_000,
        4 => 1_000,
        _ => 200,
    };

    amount = amount * 1000;

    return amount * period.as_u64();
}

abi RegistryTestContract {
    #[storage(read, write)]
    fn register(name: String, resolver: b256, period: u16, timestamp: u64);

    fn calculate_domain_price(domain: String, period: u16) -> u64;
}


impl RegistryTestContract for Contract {
    #[storage(read, write)]
    fn register(name: String, resolver: b256, period: u16, timestamp: u64){
        let address = sha256(msgsender_address());
        let handle = sha256(name);

        let domain = storage.domains.get(handle).read_slice();

        if (domain.is_some()) {
           let handle = BakoHandle::from(domain.unwrap());
           require(!handle.is_expired(), RegistryTestContractError::DomainUnavailable);
        }

        let retrived_handle = BakoHandle::new(
            name, 
            address, 
            resolver,
            true, 
            timestamp, 
            period
        );

        storage.domains.insert(handle, StorageBytes {});
        storage.domains.get(handle).write_slice(retrived_handle.into());
    }
    
    fn calculate_domain_price(domain: String, period: u16) -> u64 {
        return domain_price(domain, period);
    }
}
