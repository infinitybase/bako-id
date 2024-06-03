library;

use std::{
    hash::*,
    bytes::Bytes,
    string::String,
    context::msg_amount,
    block::timestamp,
    contract_id::ContractId,
    constants::BASE_ASSET_ID,
    bytes_conversions::u16::*,
    call_frames::{ msg_asset_id },
};
use libraries::{
    abis::{StorageContract},
    structures::{BakoHandle},
    validations::{
        assert_name_validity,
    },
};

pub struct GracePeriod {
    timestamp: u64,
    period: u64,
    grace_period: u64,
}


abi InfoContract {
    #[storage(read)]
    fn get_all(owner: b256) -> Bytes;

    #[storage(read)]
    fn get_grace_period(owner: b256) -> GracePeriod;
}




#[storage(read)]
pub fn _get_all(owner: b256, bako_id: ContractId) -> Bytes {
    let storage = abi(StorageContract, bako_id.into());

    let vec = storage.get_all(owner);
    let mut vec_bytes = Bytes::new();

    let mut i = 0;
    while i < vec.len() {
        let handle_bytes = vec.get(i).unwrap();
        let handle = BakoHandle::from(handle_bytes);
        vec_bytes.append(handle.name.as_bytes().len().try_as_u16().unwrap().to_be_bytes());
        vec_bytes.append(handle.name.as_bytes());
        vec_bytes.push(0u8);
        vec_bytes.push(1u8);
        vec_bytes.push(match handle.primary { true => 1u8, false => 0u8, });
        i += 1;
    }

    return vec_bytes;
}

#[storage(read)]
pub fn _get_grace_period(owner: String, bako_id: ContractId) -> GracePeriod {
    let grace_period: u64 = 90 * 24 * 3600; // 90 days of grace period
    let owner = sha256(owner);
    let storage = abi(StorageContract, bako_id.into());

    let handle = storage.get(owner);

   match handle {
        Some(handle_bytes) => {
            let handle = BakoHandle::from(handle_bytes);
            
            let timestamp = handle.timestamp;
            let period = handle.period.as_u64() * handle.timestamp;
            let grace_period = handle.period.as_u64()  * handle.timestamp + grace_period;


            return {
                GracePeriod { timestamp, period, grace_period }
            }
        },
        None => {
            return {
                GracePeriod { timestamp: 0, period: 0, grace_period: 0 }
            };
        }
    }
}