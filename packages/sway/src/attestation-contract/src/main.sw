contract;

mod abis;

use abis::{
    attestation_admin::*,
    attestation_contract::*,
};

type AttestationKey = b256;
type AttestationHash = b256;

struct AttestationInput {
    id: String,
    app: String,
    handle: String,
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
        _ => revert(0),
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