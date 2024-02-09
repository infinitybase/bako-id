library;

use std::bytes::Bytes;
use std::{
    intrinsics::{size_of, size_of_val}
};

// !!!!!! NEW FIELDS SHOULD BE ADDED TO THE END OF THE STRUCT !!!!!!
// changing the order of this fields will break the parsing from bytes
// to struct and vice versa from older versions.
pub struct FuelDomain {
    owner: b256,
    resolver: b256,
}

impl FuelDomain {
    pub fn new(owner: b256, resolver: b256) -> Self {
        Self {
            owner,
            resolver,
        }
    }

    pub fn from_bytes(bytes: Bytes) -> Self {
        let mut bytes_domain_alloc = Bytes::with_capacity(size_of::<FuelDomain>());
        bytes.buf.ptr.copy_bytes_to(bytes_domain_alloc.buf.ptr, bytes.len);
        return bytes_domain_alloc.buf.ptr.read::<FuelDomain>();
    }

    pub fn to_bytes(self) -> Bytes {
        let foo_len = size_of_val(self);
        let foo_ptr = __addr_of(self);
        let buf_len = foo_len / size_of::<u8>();
        let foo_buf = raw_slice::from_parts::<u8>(foo_ptr, buf_len);
        return Bytes::from(foo_buf);
    }
}
