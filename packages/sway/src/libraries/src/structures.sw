library;

use std::{
    bytes::Bytes,
    convert::From,
    string::String,
    bytes_conversions::u16::*,
    primitive_conversions::{ u64::*, b256::* },
    intrinsics::{size_of, size_of_val},
};

// !!!!!! NEW FIELDS SHOULD BE ADDED TO THE END OF THE STRUCT !!!!!!
// changing the order of this fields will break the parsing from bytes
// to struct and vice versa from older versions.
pub struct BakoHandle {
    name: String,
    owner: b256,
    resolver: b256,
    primary: bool,
}

impl From<Bytes> for BakoHandle {
    fn from(bytes: Bytes) -> Self {
        // Get the name length and name bytes
        let (left, right) = bytes.split_at(2);
        let name_len = left.get(1).unwrap();
        let (name_bytes, right) = right.split_at(name_len.as_u64());
        let name = String::from(name_bytes);
        
        // Get the owner address length and address bytes
        let (left, right) = right.split_at(2);
        let address_len = left.get(1).unwrap();
        let (owner_bytes, right) = right.split_at(address_len.as_u64());
        let owner = b256::try_from(owner_bytes).unwrap();

        // Get the resolver address length and address bytes
        let (left, right) = right.split_at(2);
        let address_len = left.get(1).unwrap();
        let (resolver_bytes, right) = right.split_at(address_len.as_u64());
        let resolver = b256::try_from(resolver_bytes).unwrap();

        // Get the resolver address length and address bytes
        let (left, right) = right.split_at(2);
        let primary_len = left.get(1).unwrap();
        let (primary_bytes, _) = right.split_at(primary_len.as_u64());
        let primary = primary_bytes.get(0).unwrap() == 1u8;

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