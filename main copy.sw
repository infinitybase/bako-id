contract;

mod interface;

use ::interface::{FuelDomainsContract};
use libraries::{FuelDomain, ProxyContract};
use std::{
    hash::{Hash, sha256},
    string::String,
    contract_id::ContractId,
    intrinsics::{size_of, size_of_val}
};
use std::storage::storage_bytes::*;
use std::bytes::Bytes;

storage {
    proxy_id: Option<ContractId> = Option::None,
}

fn addr_of<T>(val: T) -> raw_ptr {
    if !__is_reference_type::<T>() {
        revert(0);
    }
    asm(ptr: val) {
        ptr: raw_ptr
    }
}

// fn ptr_as_bytes(ptr: raw_ptr) -> Bytes {
//     let mut bytes = Bytes::with_capacity(8);
//     bytes.len = 8;

//     // Need to copy pointer to heap so it has an address and can be copied onto the bytes buffer
//     let mut ptr_on_heap = Vec::new();
//     ptr_on_heap.push(ptr);
//     ptr_on_heap.buf.ptr.copy_bytes_to(bytes.buf.ptr, 8);

//     bytes
// }

fn domain_to_raw_slice(domain: FuelDomain) -> raw_slice {
    let raw_ptr = asm(ptr: (addr_of(domain), size_of_val(domain))) {
        ptr: raw_ptr
    };
    let raw_slice = asm(ptr: (raw_ptr.add_uint_offset(16), size_of_val(domain))) {
        ptr: raw_slice
    };

    return raw_slice;
}

fn bytes_to_domain(bytes: Bytes) -> FuelDomain {
    let raw_ptr = asm(ptr: (addr_of(bytes), size_of_val(bytes))) {
        ptr: raw_ptr
    };
    let aaa: FuelDomain = raw_ptr.add_uint_offset(32).read();
    return aaa;
}

/* TODO: check address to set proxy contract id */
impl FuelDomainsContract for Contract {
    #[storage(write)]
    fn constructor(proxy_id: ContractId) {
        /* TODO: add validation for just owner of contract can call this method */
        storage.proxy_id.write(Option::Some(proxy_id));
    }

    #[storage(read)]
    fn register(name: String, owner: b256, resolver: b256) {
        // let sender = msg_sender();
        /* TODO: add payable */
        let domain_hash = sha256(name);
        // log(storage.proxy_id.read().unwrap().into());
        let proxy = abi(ProxyContract, storage.proxy_id.read().unwrap().into());
        let domain = FuelDomain::new(owner, resolver);

        let mut test_vec = Vec::<u8>::new();
        // test_vec.push(5);
        // test_vec.push(7);
        // test_vec.push(9);
        // test_vec.push(11);

        // Create a struct
        // let foo = TestStruct {
        //     boo: true,
        //     uwu: 42,
        // };
        let foo_len = size_of_val(domain);
        let foo_ptr = __addr_of(domain);
        let buf_len = foo_len / size_of::<u8>();
        let foo_buf = raw_slice::from_parts::<u8>(foo_ptr, buf_len);
        let vec_dmain = Vec::<u8>::from(foo_buf);

        let mut bytes_domain = Bytes::with_capacity(vec_dmain.len());
        let mut i = 0;
        while i < vec_dmain.len() {
            bytes_domain.push(vec_dmain.get(i).unwrap());
            i += 1;
        }
       
        let aaa: FuelDomain = bytes_domain.buf.ptr.read();
        log(aaa);



        proxy.set(domain_hash, vec_dmain);


            // call_with_function_selector_vec(target, function_selector, calldata, single_value_type_arg, call_params);
        

        // let raw_ptr = asm(ptr: (addr_of(domain), size_of_val(domain))) {
        //     ptr: raw_ptr
        // };
        // let raw_slice = asm(ptr: (raw_ptr.add_uint_offset(16), size_of_val(domain))) {
        //     ptr: raw_slice
        // };
        // let mut _bytes = Bytes::from(raw_slice);

        // bytes.read();
        // let _vec = Vec::<u8>::from(bytes);
        // Bytes::from(
        // let bytes = ptr_as_bytes(_raw_ptr);

        // let raw_ptr2 = asm(ptr: (addr_of(bytes), size_of_val(bytes))) {
        //     ptr: raw_ptr
        // };
        // let mut bytes = Bytes::with_capacity(8);
        // bytes.len = 8;
        // let byes = Bytes::from(raw_slice);
        // let mut ptr_on_heap = Vec::new();
        // ptr_on_heap.push(raw_ptr);
        // ptr_on_heap.buf.ptr.copy_bytes_to(raw_ptr.buf.ptr, 8);

        // let aaa: FuelDomain = .read();
        // log(aaa);

        // log(1);
        // log(sha256(vec)); // 0xaa326ed651e4a0a0c63b9ed2bc0fbe7d7d4215f06cabc981a6f4e2b800a5f7f0
        // proxy.set(domain_hash, ptr_as_bytes(_raw_ptr));
        // log(bbb);
        // let domain2 = asm(ptr: (addr_of(aaaa), size_of_val(aaaa))) {
        //     ptr: b256
        // };
        // log(domain2);
        // log(foo_buf.ptr());
        // let slice_1 = asm(ptr: (__addr_of(domain), foo_len)) {
        //     ptr: b256
        // };
        // log(slice_1);
        // from_parts
        // log(domain);
    }

    #[storage(read)]
    fn resolver(name: String) -> FuelDomain {
        // let sender = msg_sender();
        // let domain_hash = sha256(name);
        // let proxy = abi(ProxyContract, storage.proxy_id.read().unwrap().into());
        // let bytes = proxy.get(domain_hash);
        // // let domain = asm(ptr: (__addr_of(bytes), __size_of::<FuelDomain>())) {
        // //     ptr: FuelDomain
        // // };
        // // log(sha256(bytes));
        // let domain = bytes_to_domain(bytes);
        // // log(domain);
        // // FuelDomain::new(domain_hash, domain_hash)
        // domain
        return FuelDomain::new(0xaa326ed651e4a0a0c63b9ed2bc0fbe7d7d4215f06cabc981a6f4e2b800a5f7f0, 0xaa326ed651e4a0a0c63b9ed2bc0fbe7d7d4215f06cabc981a6f4e2b800a5f7f0);
    }
}
