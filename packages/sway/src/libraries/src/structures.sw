library;

use std::{
    bytes::Bytes,
    convert::From,
    string::String,
    bytes_conversions::u16::*,
    primitive_conversions::{ u64::*, b256::* },
    intrinsics::{size_of, size_of_val},
};

enum BytesValue {
    Bool: bool,
    B256: b256,
    String: String
}

impl BytesValue {
    fn as_bool(self) -> bool {
        match self {
            Self::Bool(value) => value,
            _ => revert(0),
        }
    }

    fn as_b256(self) -> b256 {
        match self {
            Self::B256(value) => value,
            _ => revert(0),
        }
    }

    fn as_string(self) -> String {
        match self {
            Self::String(value) => value,
            _ => revert(0),
        }
    }
}

// !!!!!! NEW FIELDS SHOULD BE ADDED TO THE END OF THE STRUCT !!!!!!
// changing the order of this fields will break the parsing from bytes
// to struct and vice versa from older versions.
pub struct BakoHandle {
    name: String,
    owner: b256,
    resolver: b256,
    primary: bool,
}

fn read_bytes(bytes: Bytes) -> (Bytes, BytesValue) {
    let (left, right) = bytes.split_at(2);
    let value_len = left.get(1).unwrap();
    let (value_bytes, right) = right.split_at(value_len.as_u64());
    let value = match value_bytes.len() {
        1 => BytesValue::Bool(value_bytes.get(0).unwrap() == 1u8),
        32 => BytesValue::B256(b256::try_from(value_bytes).unwrap()),
        _ => BytesValue::String(String::from(value_bytes)),
    };
    return (right, value);
}

impl From<Bytes> for BakoHandle {
    fn from(bytes: Bytes) -> Self {
        // Get the name length and name bytes
        let (bytes, value) = read_bytes(bytes);
        let name = value.as_string();
        
        // Get the owner address length and address bytes
        let (bytes, value) = read_bytes(bytes);
        let owner = value.as_b256();

        // Get the resolver address length and address bytes
        let (bytes, value) = read_bytes(bytes);
        let resolver = value.as_b256();

        // Get the resolver address length and address bytes
        let (_, value) = read_bytes(bytes);
        let primary = value.as_bool();

        return Self {
            name,
            owner,
            resolver,
            primary,
        };
    }

    fn into(self) -> Bytes {
        let mut bytes = Bytes::new();

        // Append the name length and name bytes
        bytes.append(self.name.as_bytes().len().try_as_u16().unwrap().to_be_bytes());
        bytes.append(self.name.as_bytes());

        // Append the owner address length and address bytes
        bytes.append(Bytes::from(self.owner).len().try_as_u16().unwrap().to_be_bytes());
        bytes.append(Bytes::from(self.owner));

        // Append the resolver address length and address bytes
        bytes.append(Bytes::from(self.resolver).len().try_as_u16().unwrap().to_be_bytes());
        bytes.append(Bytes::from(self.resolver));

        // Append bytes representing the primary field
        bytes.push(0u8);
        bytes.push(1u8);
        bytes.push(match self.primary { true => 1u8, false => 0u8, });

        return bytes;
    }
} 

impl BakoHandle {
    pub fn new(name: String, owner: b256, resolver: b256, primary: bool) -> Self {
        Self {
            name,
            owner,
            resolver,
            primary,
        }
    }
}


#[test]
fn test_domain_convertion() {
    use std::hash::*;

    let my_handle = BakoHandle::new(
        String::from_ascii_str("myhandle"),
        sha256("OWNER"),
        sha256("RESOLVER"),
        true,
    );

    let handle_bytes: Bytes = my_handle.into(); 
    let handle_from_bytes = BakoHandle::from(handle_bytes);

    assert(my_handle.name == handle_from_bytes.name);
}

#[test] 
fn test_read_bytes() {
    use std::hash::*;

    let my_handle = BakoHandle::new(
        String::from_ascii_str("myhandle"),
        sha256("OWNER"),
        sha256("RESOLVER"),
        true,
    );
    let bytes: Bytes = my_handle.into();

    let (bytes, value) = read_bytes(bytes);
    let name = value.as_string();
    assert(name == my_handle.name);

    let (bytes, value) = read_bytes(bytes);
    let owner = value.as_b256();
    assert(owner == my_handle.owner);

    let (bytes, value) = read_bytes(bytes);
    let resolver = value.as_b256();
    assert(resolver == my_handle.resolver);

    let (_, value) = read_bytes(bytes);
    let is_primary = value.as_bool();
    assert(is_primary == my_handle.primary);
}

#[test(should_revert)] 
fn test_read_invalid_byte_value() {
    use std::hash::*;

    let my_handle = BakoHandle::new(
        String::from_ascii_str("myhandle"),
        sha256("OWNER"),
        sha256("RESOLVER"),
        true,
    );
    let bytes: Bytes = my_handle.into();

    let (bytes, value) = read_bytes(bytes);
    let name = value.as_b256();
}