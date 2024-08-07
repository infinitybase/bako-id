/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.92.0
  Forc version: 0.61.2
  Fuel-Core version: 0.31.0
*/

import type {
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;

interface TestContractAbiInterface extends Interface {
  functions: {
    test_get: FunctionFragment;
    test_set: FunctionFragment;
  };
}

export class TestContractAbi extends Contract {
  interface: TestContractAbiInterface;
  functions: {
    test_get: InvokeFunction<[storage_id: ContractIdInput], void>;
    test_set: InvokeFunction<[storage_id: ContractIdInput], void>;
  };
}
