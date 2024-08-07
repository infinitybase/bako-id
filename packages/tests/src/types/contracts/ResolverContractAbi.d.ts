/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.92.0
  Forc version: 0.61.2
  Fuel-Core version: 0.31.0
*/

import type {
  BigNumberish,
  BN,
  Bytes,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Option, Enum } from "./common";

export enum ResolverContractErrorInput { AlreadyInitialized = 'AlreadyInitialized', StorageNotInitialized = 'StorageNotInitialized' };
export enum ResolverContractErrorOutput { AlreadyInitialized = 'AlreadyInitialized', StorageNotInitialized = 'StorageNotInitialized' };

export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;

interface ResolverContractAbiInterface extends Interface {
  functions: {
    constructor: FunctionFragment;
    owner: FunctionFragment;
    resolver: FunctionFragment;
    name: FunctionFragment;
  };
}

export class ResolverContractAbi extends Contract {
  interface: ResolverContractAbiInterface;
  functions: {
    constructor: InvokeFunction<[storage_id: ContractIdInput], void>;
    owner: InvokeFunction<[name: StdString], Option<string>>;
    resolver: InvokeFunction<[name: StdString], Option<string>>;
    name: InvokeFunction<[address: string], StdString>;
  };
}