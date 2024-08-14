contract;

mod abis;

use abis::{
    attestation_admin::*,
    attestation_contract::*,
};

type AttestationKey = b256;
type AttestationHash = b256;

pub struct AttestationInput {
    id: String,
    app: String,
    handle: String,
}

enum AttestationContractError {
    AttesterNotSet: (),
    AttesterMismatch: (),
    OnlyAttester: (),
}

storage {
    attester: Address = Address::from(b256::zero()),
    attestations: StorageMap<AttestationKey, AttestationHash> = StorageMap {},
}

#[storage(read)]
fn only_attester() {
    let attester = storage.attester;
    match msg_sender() {
        Identity::Address(address) if address == attester => (),
        Identity::Address(address) => if address != attester {
            revert(AttestationContractError::OnlyAttester)
        },
        _ => revert(AttestationContractError::AttesterNotSet),
    }
}

impl AttestationHash {
    fn hash(input: AttestationInput) -> Self {  
        let hash = sha256(input.id + input.app + input.handle);
        return hash;
    }
}


impl Attestation for Contract {
    #[storage(read, write)]
    fn attest(input: AttestationInput) -> AttestationKey {
        only_attester();
        let attestation_key = AttestationKey::hash(input);
        attestations.insert(attestation_key, AttestationHash::hash(input));
        return attestation_key;
    }

    #[storage(read)]
    fn verify(attestation_key: AttestationKey) -> Option<AttestationHash> {
        attestations.get(attestation_key)
    }
}

impl AttestationAdmin for Contract {
    #[storage(read, write)]
    fn constructor(attester: Address) {
        if storage.attester != Address::from(b256::zero()) {
            revert(AttestationContractError::AttesterMismatch)
        }
        storage.attester = attester;
    }

    #[storage(read)]
    fn attester() -> Address {
        return storage.attester
    }

    #[storage(write)]
    fn set_attester(attester: Address) {
        only_attester();
        storage.attester = attester;
    }
}