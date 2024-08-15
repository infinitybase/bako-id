library;

use std::{bytes::Bytes, hash::*, string::String,};
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
