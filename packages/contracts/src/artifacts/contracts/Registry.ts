/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.96.1
  Forc version: 0.66.4
  Fuel-Core version: 0.40.0
*/

import { Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  AbstractAddress,
  BigNumberish,
  BN,
  Bytes,
  FunctionFragment,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Option, Enum } from "./common";

export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export type MetadataInput = Enum<{ B256: [], Bytes: Bytes, Int: BigNumberish, String: StdString }>;
export type MetadataOutput = Enum<{ B256: [], Bytes: Bytes, Int: BN, String: StdString }>;
export enum NameValidationErrorInput { InvalidLenght = 'InvalidLenght', InvalidChars = 'InvalidChars', IsEmpty = 'IsEmpty' };
export enum NameValidationErrorOutput { InvalidLenght = 'InvalidLenght', InvalidChars = 'InvalidChars', IsEmpty = 'IsEmpty' };
export enum RegistryContractErrorInput { IncorrectAssetId = 'IncorrectAssetId', InvalidAmount = 'InvalidAmount', AlreadyMinted = 'AlreadyMinted', AlreadyInitialized = 'AlreadyInitialized', ContractNotBeZero = 'ContractNotBeZero', ContractNotInitialized = 'ContractNotInitialized', NotOwner = 'NotOwner', NotFoundName = 'NotFoundName' };
export enum RegistryContractErrorOutput { IncorrectAssetId = 'IncorrectAssetId', InvalidAmount = 'InvalidAmount', AlreadyMinted = 'AlreadyMinted', AlreadyInitialized = 'AlreadyInitialized', ContractNotBeZero = 'ContractNotBeZero', ContractNotInitialized = 'ContractNotInitialized', NotOwner = 'NotOwner', NotFoundName = 'NotFoundName' };

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type NewNameEventInput = { name: StdString, name_hash: string, owner: IdentityInput, resolver: IdentityInput, asset_id: AssetIdInput };
export type NewNameEventOutput = { name: StdString, name_hash: string, owner: IdentityOutput, resolver: IdentityOutput, asset_id: AssetIdOutput };
export type RecordDataInput = { owner: IdentityInput, resolver: IdentityInput, period: BigNumberish, timestamp: BigNumberish };
export type RecordDataOutput = { owner: IdentityOutput, resolver: IdentityOutput, period: number, timestamp: BN };

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "enum RegistryContractError",
      "concreteTypeId": "80b09233651e30b7fa04b552a421e25fc4ea6dd8c3c8051ad05c9c2b4f6a13ce",
      "metadataTypeId": 1
    },
    {
      "type": "enum lib::validations::NameValidationError",
      "concreteTypeId": "3d558a9e1ceda727203eccf236db03255f30ce308181b93340f5ffb2e19831d8",
      "metadataTypeId": 2
    },
    {
      "type": "enum standards::src7::Metadata",
      "concreteTypeId": "f44b531974c6c04e17e66ab54e9868d230b9a24b3710b184399c363f0190180d",
      "metadataTypeId": 3
    },
    {
      "type": "enum std::identity::Identity",
      "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335",
      "metadataTypeId": 4
    },
    {
      "type": "enum std::option::Option<struct lib::abis::manager::RecordData>",
      "concreteTypeId": "f9212aadfc7e62516fa2ffae7be391807a1a2ec3dd63b662a25fd394cb0f8871",
      "metadataTypeId": 5,
      "typeArguments": [
        "a06087fea05d71c273e06e235102af0ef06e08660df4f94ecbe49e7f96ab4635"
      ]
    },
    {
      "type": "struct events::NewNameEvent",
      "concreteTypeId": "de123b38a3d90c3cc5a3b578a47a6105e998b48d85f6fcf34c1b4b3907806a75",
      "metadataTypeId": 8
    },
    {
      "type": "struct lib::abis::manager::RecordData",
      "concreteTypeId": "a06087fea05d71c273e06e235102af0ef06e08660df4f94ecbe49e7f96ab4635",
      "metadataTypeId": 9
    },
    {
      "type": "struct std::asset_id::AssetId",
      "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974",
      "metadataTypeId": 11
    },
    {
      "type": "struct std::contract_id::ContractId",
      "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      "metadataTypeId": 14
    },
    {
      "type": "struct std::string::String",
      "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c",
      "metadataTypeId": 15
    },
    {
      "type": "u16",
      "concreteTypeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
    }
  ],
  "metadataTypes": [
    {
      "type": "b256",
      "metadataTypeId": 0
    },
    {
      "type": "enum RegistryContractError",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "IncorrectAssetId",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "InvalidAmount",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AlreadyMinted",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AlreadyInitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ContractNotBeZero",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ContractNotInitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "NotOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "NotFoundName",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum lib::validations::NameValidationError",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "InvalidLenght",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "InvalidChars",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "IsEmpty",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum standards::src7::Metadata",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "B256",
          "typeId": 0
        },
        {
          "name": "Bytes",
          "typeId": 12
        },
        {
          "name": "Int",
          "typeId": 16
        },
        {
          "name": "String",
          "typeId": 15
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "Address",
          "typeId": 10
        },
        {
          "name": "ContractId",
          "typeId": 14
        }
      ]
    },
    {
      "type": "enum std::option::Option",
      "metadataTypeId": 5,
      "components": [
        {
          "name": "None",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Some",
          "typeId": 6
        }
      ],
      "typeParameters": [
        6
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 6
    },
    {
      "type": "raw untyped ptr",
      "metadataTypeId": 7
    },
    {
      "type": "struct events::NewNameEvent",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "name",
          "typeId": 15
        },
        {
          "name": "name_hash",
          "typeId": 0
        },
        {
          "name": "owner",
          "typeId": 4
        },
        {
          "name": "resolver",
          "typeId": 4
        },
        {
          "name": "asset_id",
          "typeId": 11
        }
      ]
    },
    {
      "type": "struct lib::abis::manager::RecordData",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "owner",
          "typeId": 4
        },
        {
          "name": "resolver",
          "typeId": 4
        },
        {
          "name": "period",
          "typeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        },
        {
          "name": "timestamp",
          "typeId": 16
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 10,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::asset_id::AssetId",
      "metadataTypeId": 11,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::bytes::Bytes",
      "metadataTypeId": 12,
      "components": [
        {
          "name": "buf",
          "typeId": 13
        },
        {
          "name": "len",
          "typeId": 16
        }
      ]
    },
    {
      "type": "struct std::bytes::RawBytes",
      "metadataTypeId": 13,
      "components": [
        {
          "name": "ptr",
          "typeId": 7
        },
        {
          "name": "cap",
          "typeId": 16
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 14,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::string::String",
      "metadataTypeId": 15,
      "components": [
        {
          "name": "bytes",
          "typeId": 12
        }
      ]
    },
    {
      "type": "u64",
      "metadataTypeId": 16
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "name",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        },
        {
          "name": "resolver",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "period",
          "concreteTypeId": "29881aad8730c5ab11d275376323d8e4ff4179aae8ccb6c13fe4902137e162ef"
        }
      ],
      "name": "register",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write",
            "read"
          ]
        },
        {
          "name": "payable",
          "arguments": []
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "name",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        },
        {
          "name": "key",
          "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
        },
        {
          "name": "value",
          "concreteTypeId": "f44b531974c6c04e17e66ab54e9868d230b9a24b3710b184399c363f0190180d"
        }
      ],
      "name": "set_metadata_info",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write",
            "read"
          ]
        },
        {
          "name": "payable",
          "arguments": []
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "manager_id",
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        },
        {
          "name": "token_id",
          "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
        }
      ],
      "name": "constructor",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "9273072382193316023",
      "concreteTypeId": "80b09233651e30b7fa04b552a421e25fc4ea6dd8c3c8051ad05c9c2b4f6a13ce"
    },
    {
      "logId": "4419591021028812583",
      "concreteTypeId": "3d558a9e1ceda727203eccf236db03255f30ce308181b93340f5ffb2e19831d8"
    },
    {
      "logId": "16001917540453911612",
      "concreteTypeId": "de123b38a3d90c3cc5a3b578a47a6105e998b48d85f6fcf34c1b4b3907806a75"
    },
    {
      "logId": "11132648958528852192",
      "concreteTypeId": "9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c"
    },
    {
      "logId": "17951676516429357649",
      "concreteTypeId": "f9212aadfc7e62516fa2ffae7be391807a1a2ec3dd63b662a25fd394cb0f8871"
    },
    {
      "logId": "13213829929622723620",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "logId": "13866877265493744985",
      "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
    },
    {
      "logId": "17603254937306185806",
      "concreteTypeId": "f44b531974c6c04e17e66ab54e9868d230b9a24b3710b184399c363f0190180d"
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const storageSlots: StorageSlot[] = [
  {
    "key": "e1a8f7a09ac9a2ed6301cda0a0c44ba28d5361e2617ea7a369d53fd6ffa141b1",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  {
    "key": "ef8d07fbe8ff11f8a3d65ab06ca184bacb3f6980dca2238bee8ea814c407e23b",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class RegistryInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    register: FunctionFragment;
    set_metadata_info: FunctionFragment;
    constructor: FunctionFragment;
  };
}

export class Registry extends Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: RegistryInterface;
  declare functions: {
    register: InvokeFunction<[name: StdString, resolver: IdentityInput, period: BigNumberish], void>;
    set_metadata_info: InvokeFunction<[name: StdString, key: StdString, value: MetadataInput], void>;
    constructor: InvokeFunction<[manager_id: ContractIdInput, token_id: ContractIdInput], void>;
  };

  constructor(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
