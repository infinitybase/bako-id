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
    abis::{StorageContract},
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

    #[storage(read)]
    fn get_all(owner: b256, bako_id: ContractId) -> Bytes;

    #[storage(read)]
    fn get_grace_period(owner: b256) -> (u64, u64, u64);
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

    #[storage(read)]
    fn get_all(owner: b256, bako_id: ContractId) -> Bytes {
       let storage = abi(StorageContract, bako_id.into());

        let vec = storage.get_all(owner);
        let mut vec_bytes = Bytes::new();

        let mut i = 0;
        while i < vec.len() {
            let handle_bytes = vec.get(i).unwrap();
            let handle = BakoHandle::from(handle_bytes);
            vec_bytes.append(handle.name.as_bytes().len().try_as_u16().unwrap().to_be_bytes());
            vec_bytes.append(handle.name.as_bytes());
            vec_bytes.push(0u8);
            vec_bytes.push(1u8);
            vec_bytes.push(match handle.primary { true => 1u8, false => 0u8, });
            i += 1;
        }

        return vec_bytes;
    }

    #[storage(read)]
    fn get_grace_period(owner: b256) -> (u64, u64, u64) {
        let grace_period: u64 = 90 * 24 * 3600; // 90 days of grace period

        let handle = storage.domains.get(owner).read_slice();

        match handle {
            Some(handle_bytes) => {
                let handle = BakoHandle::from(handle_bytes);

                let timestamp = handle.timestamp;
                let period = handle.period.as_u64() * handle.timestamp;
                let grace_period = handle.period.as_u64() * handle.timestamp + grace_period;

                return (timestamp, period, grace_period);
            },
            None => {
                return (0, 0, 0);
            }
        }
    }
}
