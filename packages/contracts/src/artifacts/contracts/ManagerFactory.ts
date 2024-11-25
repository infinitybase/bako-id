/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.96.1
  Forc version: 0.66.4
  Fuel-Core version: 0.40.0
*/

import { Contract, ContractFactory, decompressBytecode } from "fuels";
import type { Provider, Account, DeployContractOptions, DeployContractResult } from "fuels";

import { Manager } from "./Manager";

const bytecode = decompressBytecode("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");

export class ManagerFactory extends ContractFactory {

  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, Manager.abi, accountOrProvider);
  }

  override deploy<TContract extends Contract = Contract>(
    deployOptions?: DeployContractOptions
  ): Promise<DeployContractResult<TContract>> {
    return super.deploy({
      storageSlots: Manager.storageSlots,
      ...deployOptions,
    });
  }

  static async deploy (
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<Manager>> {
    const factory = new ManagerFactory(wallet);
    return factory.deploy(options);
  }
}
