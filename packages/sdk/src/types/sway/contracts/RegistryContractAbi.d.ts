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
  Contract,
  FunctionFragment,
  Interface,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Enum, Option } from './common';

export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;
export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;
export type MetadataInput = Enum<{
  B256: string;
  Bytes: Bytes;
  Int: BigNumberish;
  String: StdString;
}>;
export type MetadataOutput = Enum<{
  B256: string;
  Bytes: Bytes;
  Int: BN;
  String: StdString;
}>;
export enum NameValidationErrorInput {
  InvalidLenght = 'InvalidLenght',
  InvalidChars = 'InvalidChars',
  IsEmpty = 'IsEmpty',
}
export enum NameValidationErrorOutput {
  InvalidLenght = 'InvalidLenght',
  InvalidChars = 'InvalidChars',
  IsEmpty = 'IsEmpty',
}
export type PermissionInput = Enum<{
  Authorized: IdentityInput;
  Unauthorized: [];
  NotFound: [];
}>;
export type PermissionOutput = Enum<{
  Authorized: IdentityOutput;
  Unauthorized: [];
  NotFound: [];
}>;
export enum RegistryContractErrorInput {
  StorageNotInitialized = 'StorageNotInitialized',
  AlreadyInitialized = 'AlreadyInitialized',
  DomainNotAvailable = 'DomainNotAvailable',
  IncorrectAssetId = 'IncorrectAssetId',
  InvalidDomain = 'InvalidDomain',
  InvalidAmount = 'InvalidAmount',
  InvalidPermission = 'InvalidPermission',
  NotOwner = 'NotOwner',
  SameResolver = 'SameResolver',
  AlreadyPrimary = 'AlreadyPrimary',
}
export enum RegistryContractErrorOutput {
  StorageNotInitialized = 'StorageNotInitialized',
  AlreadyInitialized = 'AlreadyInitialized',
  DomainNotAvailable = 'DomainNotAvailable',
  IncorrectAssetId = 'IncorrectAssetId',
  InvalidDomain = 'InvalidDomain',
  InvalidAmount = 'InvalidAmount',
  InvalidPermission = 'InvalidPermission',
  NotOwner = 'NotOwner',
  SameResolver = 'SameResolver',
  AlreadyPrimary = 'AlreadyPrimary',
}

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type GracePeriodInput = {
  timestamp: BigNumberish;
  period: BigNumberish;
  grace_period: BigNumberish;
};
export type GracePeriodOutput = { timestamp: BN; period: BN; grace_period: BN };
export type HandleMintedEventInput = {
  domain_hash: string;
  owner: IdentityInput;
  resolver: string;
  asset: AssetIdInput;
};
export type HandleMintedEventOutput = {
  domain_hash: string;
  owner: IdentityOutput;
  resolver: string;
  asset: AssetIdOutput;
};
export type NewResolverEventInput = { domain_hash: string; resolver: string };
export type NewResolverEventOutput = NewResolverEventInput;

export interface RegistryContractAbiInterface extends Interface {
  functions: {
    constructor: FunctionFragment;
    edit_resolver: FunctionFragment;
    register: FunctionFragment;
    set_primary_handle: FunctionFragment;
    decimals: FunctionFragment;
    name: FunctionFragment;
    symbol: FunctionFragment;
    total_assets: FunctionFragment;
    total_supply: FunctionFragment;
    metadata: FunctionFragment;
    image_url: FunctionFragment;
    get_all: FunctionFragment;
    get_grace_period: FunctionFragment;
  };
}

export class RegistryContractAbi extends Contract {
  interface: RegistryContractAbiInterface;
  functions: {
    constructor: InvokeFunction<
      [owner: AddressInput, storage_id: ContractIdInput],
      void
    >;
    edit_resolver: InvokeFunction<[name: StdString, resolver: string], void>;
    register: InvokeFunction<
      [name: StdString, resolver: string, period: BigNumberish],
      AssetIdOutput
    >;
    set_primary_handle: InvokeFunction<[name: StdString], void>;
    decimals: InvokeFunction<[asset: AssetIdInput], Option<number>>;
    name: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    symbol: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    total_assets: InvokeFunction<[], BN>;
    total_supply: InvokeFunction<[asset: AssetIdInput], Option<BN>>;
    metadata: InvokeFunction<
      [asset: AssetIdInput, key: StdString],
      Option<MetadataOutput>
    >;
    image_url: InvokeFunction<[name: StdString], StdString>;
    get_all: InvokeFunction<[owner: string], Bytes>;
    get_grace_period: InvokeFunction<[owner: StdString], GracePeriodOutput>;
  };
}
