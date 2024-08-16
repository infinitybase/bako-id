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
    let attester = storage.attester.read();
    let msg_sender = msg_sender().unwrap().as_address().unwrap();

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
    fn verify(attestation_key: AttestationKey) -> Option<AttestationHash> {
        let attestation_hash = storage.attestations.get(attestation_key).try_read();
        return attestation_hash;
    }
}

impl AttestationAdmin for Contract {
    #[storage(read, write)]
    fn constructor(attester: Address) {
        let attester_address = storage.attester.read();

        require(
            attester_address == Address::from(b256::zero()),
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
    let attestation = abi(Attestation, b256::zero());
    let input = AttestationInput {
        id: String::from_ascii_str("test"),
        app: String::from_ascii_str("farcaster"),
        handle: String::from_ascii_str("testjon"),
    };

    let attestation_key = attestation.attest(input);
    log(attestation_key);
    let attestation_hash = attestation.verify(attestation_key);

    assert(attestation_hash.is_some());
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

#[test]
fn test_hash() {
    let input = AttestationInput {
        id: String::from_ascii_str("test"),
        app: String::from_ascii_str("farcaster"),
        handle: String::from_ascii_str("testjon"),
    };

    let hash = AttestationHash::hash(input);
    assert(hash == b256::zero());
}
