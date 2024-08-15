contract;

mod abis;

use abis::{attestation_admin::*, attestation_contract::*,};

use std::{bytes::Bytes, hash::*, string::*,};

enum AttestationContractError {
    AttesterNotSet: (),
    AttesterMismatch: (),
    OnlyAttester: (),
    AttestationContractAlreadyInitialized: (),
}

storage {
    attester: Address = Address::from(b256::zero()),
    attestations: StorageMap<AttestationKey, AttestationHash> = StorageMap {},
}

#[storage(read)]
fn only_attester() {
    let attester = storage.attester.field_id();
    let msg_sender: b256 = msg_sender().unwrap().as_address().unwrap().into();

    require(
        attester == msg_sender,
        AttestationContractError::OnlyAttester,
    );
}

impl AttestationHash {
    fn hash(input: AttestationInput) -> Self {
        let hash = sha256((input.id, input.app, input.handle));
        return hash;
    }
}

impl Attestation for Contract {
    #[storage(read, write)]
    fn attest(input: AttestationInput) -> AttestationKey {
        let attestation_hash = AttestationHash::hash(input);
        let attestation_key = attestation_hash;
        storage
            .attestations
            .insert(attestation_key, attestation_hash);
        return attestation_key;
    }

    #[storage(read)]
    fn verify(attestation_key: AttestationKey) -> StorageKey<AttestationHash> {
        return storage.attestations.get(attestation_key);
    }
}

impl AttestationAdmin for Contract {
    #[storage(read, write)]
    fn constructor(attester: Address) {
        let storage_attester = Address::from(storage.attester.field_id());
        require(
            storage_attester == Address::from(b256::zero()),
            AttestationContractError::AttestationContractAlreadyInitialized,
        );

        storage.attester.write(attester);
    }

    #[storage(read)]
    fn attester() -> Address {
        return storage.attester.read()
    }

    #[storage(write)]
    fn set_attester(attester: Address) {
        only_attester();
        storage.attester.write(attester);
    }
}

#[test]
fn test_attestation() {
    let attester = Address::from(b256::zero());
    let attestation = abi(Attestation, attester.bits());
    let input = AttestationInput {
        id: String::from_ascii_str("test"),
        app: String::from_ascii_str("farcaster"),
        handle: String::from_ascii_str("testjon"),
    };

    let attestation_key = attestation.attest(input);
    let attestation_hash = attestation.verify(attestation_key);

    assert(attestation_hash.field_id() == AttestationHash::hash(input));
}

#[test]
fn test_attestation_admin() {
    let attester = Address::from(b256::zero());
    let attestation = abi(AttestationAdmin, attester.bits());
    attestation.constructor(attester);

    assert(attestation.attester() == attester);

    let new_attester = Address::from(b256::from(1));
    attestation.set_attester(new_attester);

    assert(attestation.attester() == new_attester);
}
