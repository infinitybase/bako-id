contract;

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


abi Attestation {
    #[storage(read, write)]
    fn attest(input: AttestationInput) -> AttestationKey;

    #[storage(read)]
    fn verify(attestation_key: AttestationKey) -> Option<AttestationHash>;
}

impl AttestationHash {
    fn hash(input: AttestationInput) -> Self {  
        let hash = sha256(input.id + input.app + input.handle);
        return hash;
    }
}