library;

use std::string::String;
use std::option::Option;

abi NameResolver {
    #[storage(read)]
    fn name(addr: Identity) -> Option<String>;
}
