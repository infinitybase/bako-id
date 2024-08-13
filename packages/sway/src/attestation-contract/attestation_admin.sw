library;

abi AttestationAdmin {
    #[storage(read, write)]
    fn constructor(attester: Address);

    #[storage(read)]
    fn attester() -> Address;
    
    #[storage(write)]
    fn set_attester(attester: Address);
}
