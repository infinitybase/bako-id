import { Provider, Wallet, WalletUnlocked } from 'fuels';
import { StorageContractAbi__factory, RegistryContractAbi__factory, TestContractAbi__factory } from '../types';
import registryHex from '../types/contracts/RegistryContractAbi.hex';
import storageHex from '../types/contracts/StorageContractAbi.hex';
import { storageContract, registryContract, testContract } from '../types/contract-ids.json';

const tryExecute = <T>(callback: Promise<T>) => new Promise<T>((resolve) => callback.then(resolve).catch(resolve))

const WALLET_PRIVATE_KEYS = {
  MAIN: '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  FAKE: '0x12265569a656550e6eceda7ac78a25a2e4584e5742e6420b597c9ced37ff4754',
};

const txParams = {
  gasPrice: 1,
  gasLimit: 1_000_000
};

async function setupContractsAndDeploy(wallet: WalletUnlocked) {
  const storage = await StorageContractAbi__factory.deployContract(storageHex, wallet);
  const registry = await RegistryContractAbi__factory.deployContract(registryHex, wallet);

  return {
    storage,
    registry,
  }
}

async function setupContracts(wallet: WalletUnlocked) {
  const registry = RegistryContractAbi__factory.connect(registryContract, wallet);
  const storage = StorageContractAbi__factory.connect(storageContract, wallet);
  const testCaller = TestContractAbi__factory.connect(testContract, wallet);

  const initializeRegistry = async () => {
    const { transactionResult: txRegistry } = await registry.functions.constructor({
      value: wallet.address.toB256()
    }, {
      value: storageContract
    }).txParams(txParams).call();

    return { txRegistry };
  };

  const initializeStorage = async () => {
    const { transactionResult: txProxy } = await storage.functions.constructor({
      value: wallet.address.toB256(),
    }, {
      value: registryContract,
    }).txParams(txParams).call();

    return { txProxy };
  };

  return { registry: { ...registry, initializeRegistry }, storage: { ...storage, initializeStorage }, testCaller };
}

function createWallet(provider: Provider, privateKey = WALLET_PRIVATE_KEYS.MAIN) {
  return Wallet.fromPrivateKey(privateKey, provider);
}

function randomName() {
  const name = (Math.random() + 2).toString(32).substring(2);
  return `${name}.fuel`;
}

export {
  txParams,
  tryExecute,
  randomName,
  createWallet,
  testContract,
  storageContract,
  setupContracts,
  registryContract,
  WALLET_PRIVATE_KEYS,
  setupContractsAndDeploy,
};
