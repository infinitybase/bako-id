contract;

use libraries::{
    abis::{StorageContract}
};
use std::{
    hash::{Hash, sha256},
    string::String,
    contract_id::ContractId,
    constants::ZERO_B256,
};
use std::bytes::Bytes;

abi MyContract {
    fn test_set(storage_id: ContractId);
    fn test_get(storage_id: ContractId);
}

impl MyContract for Contract {
    fn test_set(storage_id: ContractId) {
        let mut bytes = Bytes::new();
        bytes.push(10);
        bytes.push(10);
        let proxy = abi(StorageContract, storage_id.into());
        proxy.set(0xaf5570f5a1810b7af78caf4bc70a660f0df51e42baf91d4de5b2328de0e83dfc, sha256(0x1), bytes);
    }

    fn test_get(storage_id: ContractId) {
        let proxy = abi(StorageContract, storage_id.into());
        proxy.get(0xaf5570f5a1810b7af78caf4bc70a660f0df51e42baf91d4de5b2328de0e83dfc);
    }
}
