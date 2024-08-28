library;

use std::{bytes::Bytes, hash::{Hash, sha256}, string::String,};

abi StorageContract {
    #[storage(read, write)]
    fn constructor(owner: Address, registry_id: ContractId);

    #[storage(read, write)]
    fn set_implementation(registry_id: ContractId);

    #[storage(read)]
    fn get_implementation() -> Option<ContractId>;

    #[storage(read, write)]
    fn set_owner(owner: Address);

    #[storage(read)]
    fn get_owner() -> Option<Address>;

    #[storage(write)]
    fn set(hash: b256, owner: b256, value: Bytes);

    #[storage(write)]
    fn change(key: b256, bytes_domain: Bytes);

    #[storage(read)]
    fn get(hash: b256) -> Option<Bytes>;

    #[storage(write)]
    fn set_primary(key: b256, value: String);

    #[storage(read)]
    fn get_primary(resolver: b256) -> Option<Bytes>;

    #[storage(read)]
    fn get_all(owner: b256) -> Vec<Bytes>;
}

abi AttestationAdmin {
    #[storage(read, write)]
    fn constructor(attester: Address);

    #[storage(read)]
    fn attester() -> Address;

    #[storage(write)]
    fn set_attester(attester: Address);
}

pub type AttestationKey = b256;
pub type AttestationHash = b256;

pub struct AttestationInput {
    pub id: String,
    pub app: String,
    pub handle: String,
}

abi Attestation {
    #[storage(read, write)]
    fn attest(input: AttestationInput) -> AttestationKey;

    #[storage(read)]
    fn verify(attestation_key: AttestationKey) -> Option<AttestationHash>;
}
