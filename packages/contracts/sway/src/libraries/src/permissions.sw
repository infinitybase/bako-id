library;

use std::{auth::msg_sender, hash::sha256, storage::storage_api::{read, write}};

// Pre-computed hash digest of sha256("owner")
pub const OWNER = 0x4c1029697ee358715d3a14a2add817c4b01651440de808371f78165ac90dc581;

pub enum Permission {
    Authorized: Identity,
    Unauthorized: (),
    NotFound: (),
}

impl core::ops::Eq for Permission {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (Permission::Authorized(identity1), Permission::Authorized(identity2)) => {
                identity1 == identity2
            },
            (Permission::Unauthorized, Permission::Unauthorized) => true,
            (Permission::NotFound, Permission::NotFound) => true,
            _ => false,
        }
    }
}

#[storage(read)]
pub fn get_permission(permission: b256) -> Permission {
    let identity = read::<Identity>(permission, 0);
    match identity {
        Some(identity) => Permission::Authorized(identity),
        _ => Permission::NotFound,
    }
}

#[storage(read)]
pub fn with_permission(permission: b256) {
    require(
        get_permission(permission) == Permission::Authorized(msg_sender().unwrap()),
        Permission::Unauthorized,
    );
}

#[storage(read, write)]
pub fn set_permission(permission: b256, new_identity: Identity) {
    let _permission = get_permission(permission);

    if (_permission == Permission::NotFound) {
        write(permission, 0, new_identity);
    } else {
        with_permission(OWNER);
        write(permission, 0, new_identity);
    }
}
