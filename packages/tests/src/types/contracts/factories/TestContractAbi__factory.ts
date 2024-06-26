/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.81.0
  Forc version: 0.49.3
  Fuel-Core version: 0.22.1
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot } from "fuels";
import type { TestContractAbi, TestContractAbiInterface } from "../TestContractAbi";

const _abi = {
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
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "storage_id",
          "type": 2,
          "typeArguments": null
        }
      ],
      "name": "test_get",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "storage_id",
          "type": 2,
          "typeArguments": null
        }
      ],
      "name": "test_set",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": null
    }
  ],
  "loggedTypes": [],
  "messagesTypes": [],
  "configurables": []
};

const _storageSlots: StorageSlot[] = [];

export class TestContractAbi__factory {
  static readonly abi = _abi;

  static readonly storageSlots = _storageSlots;

  static createInterface(): TestContractAbiInterface {
    return new Interface(_abi) as unknown as TestContractAbiInterface
  }

  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): TestContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as TestContractAbi
  }

  static async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<TestContractAbi> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    const { storageSlots } = TestContractAbi__factory;

    const contract = await factory.deployContract({
      storageSlots,
      ...options,
    });

    return contract as unknown as TestContractAbi;
  }
}
