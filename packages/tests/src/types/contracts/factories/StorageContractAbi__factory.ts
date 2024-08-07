/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.92.0
  Forc version: 0.61.2
  Fuel-Core version: 0.31.0
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot, DeployContractResult } from "fuels";
import type { StorageContractAbi, StorageContractAbiInterface } from "../StorageContractAbi";

const _abi = {
  "encoding": "1",
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 10,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 6,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        6
      ]
    },
    {
      "typeId": 4,
      "type": "enum Permission",
      "components": [
        {
          "name": "Authorized",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "Unauthorized",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotFound",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum StorageContractError",
      "components": [
        {
          "name": "AlreadyInitialized",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "struct Address",
      "components": [
        {
          "name": "bits",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "struct Bytes",
      "components": [
        {
          "name": "buf",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "len",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "struct ContractId",
      "components": [
        {
          "name": "bits",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "struct RawBytes",
      "components": [
        {
          "name": "ptr",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        6
      ]
    },
    {
      "typeId": 13,
      "type": "struct String",
      "components": [
        {
          "name": "bytes",
          "type": 9,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 12,
          "typeArguments": [
            {
              "name": "",
              "type": 6,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        6
      ]
    },
    {
      "typeId": 15,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "key",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "bytes_domain",
          "type": 9,
          "typeArguments": null
        }
      ],
      "name": "change",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "registry_id",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "constructor",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "key",
          "type": 1,
          "typeArguments": null
        }
      ],
      "name": "get",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": [
          {
            "name": "",
            "type": 9,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "type": 1,
          "typeArguments": null
        }
      ],
      "name": "get_all",
      "output": {
        "name": "",
        "type": 14,
        "typeArguments": [
          {
            "name": "",
            "type": 9,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_implementation",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": [
          {
            "name": "",
            "type": 10,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_owner",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": [
          {
            "name": "",
            "type": 8,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "resolver",
          "type": 1,
          "typeArguments": null
        }
      ],
      "name": "get_primary",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": [
          {
            "name": "",
            "type": 9,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "key",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "owner",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "bytes_domain",
          "type": 9,
          "typeArguments": null
        }
      ],
      "name": "set",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "registry_id",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "set_implementation",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "type": 8,
          "typeArguments": null
        }
      ],
      "name": "set_owner",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "key",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "value",
          "type": 13,
          "typeArguments": null
        }
      ],
      "name": "set_primary",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "16850777566225060202",
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": "5436863990471376381",
      "loggedType": {
        "name": "",
        "type": 5,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const _storageSlots: StorageSlot[] = [
  {
    "key": "b61e266e75c64ac989315805e532e6125db4ee10ad42b2038897cf0ff4ec740a",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export const StorageContractAbi__factory = {
  abi: _abi,

  storageSlots: _storageSlots,

  createInterface(): StorageContractAbiInterface {
    return new Interface(_abi) as unknown as StorageContractAbiInterface
  },

  connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): StorageContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as StorageContractAbi
  },

  async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<StorageContractAbi>> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    return factory.deployContract<StorageContractAbi>({
      storageSlots: _storageSlots,
      ...options,
    });
  },
}