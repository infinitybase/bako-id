library;

abi Attestation {
    #[storage(read, write)]
    fn attest(input: AttestationInput) -> AttestationKey;

    #[storage(read)]
    fn verify(attestation_key: AttestationKey) -> Option<AttestationHash>;
}