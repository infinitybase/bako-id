import {
  type BN,
  BaseAssetId,
  type Provider,
  Wallet,
  type WalletUnlocked,
  bn,
} from 'fuels';
import {
  RegistryContractAbi__factory,
  StorageContractAbi__factory,
  TestContractAbi__factory,
} from '../types';
import {
  registryContract,
  storageContract,
  testContract,
} from '../types/contract-ids.json';
import registryHex from '../types/contracts/RegistryContractAbi.hex';
import storageHex from '../types/contracts/StorageContractAbi.hex';

const tryExecute = <T>(callback: Promise<T>) =>
  new Promise<T>((resolve) => callback.then(resolve).catch(resolve));

const WALLET_PRIVATE_KEYS = {
  MAIN: '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  FAKE: '0x12265569a656550e6eceda7ac78a25a2e4584e5742e6420b597c9ced37ff4754',
};

const txParams = {
  gasPrice: 1,
  gasLimit: 1_000_000,
};

export const domainPrices = (domain: string, period = 1) => {
  const domainSize = domain.length;

  if (domainSize < 3) {
    return bn(0);
  }

  const prices = {
    [3]: bn.parseUnits('0.005'),
    [4]: bn.parseUnits('0.001'),
    default: bn.parseUnits('0.0002'),
  };

  const price: BN = prices[domainSize] || prices.default;

  return price.mul(period);
};

async function setupContractsAndDeploy(wallet: WalletUnlocked) {
  const storage = await StorageContractAbi__factory.deployContract(
    storageHex,
    wallet
  );
  const registry = await RegistryContractAbi__factory.deployContract(
    registryHex,
    wallet
  );

  const initializeStorage = async () => {
    const { transactionResult: txProxy } = await storage.functions
      .constructor(
        {
          value: wallet.address.toB256(),
        },
        {
          value: registry.id.toB256(),
        }
      )
      .txParams(txParams)
      .call();

    return { txProxy };
  };

  const initializeRegistry = async () => {
    const { transactionResult: txRegistry } = await registry.functions
      .constructor(
        {
          value: wallet.address.toB256(),
        },
        {
          value: storage.id.toB256(),
        }
      )
      .txParams(txParams)
      .call();

    return { txRegistry };
  };

  const register = async (
    domain: string,
    _account: string,
    calculateAmount = true
  ) => {
    const amount = domainPrices(domain);
    const callBuilder = registry.functions.register(
      domain,
      wallet.address.toB256()
    );

    if (calculateAmount) {
      callBuilder.callParams({
        forward: { amount, assetId: BaseAssetId },
      });
    }

    return callBuilder.addContracts([storage]).txParams(txParams).call();
  };

  const connect = (wallet: WalletUnlocked) =>
    StorageContractAbi__factory.connect(storage.id, wallet);

  return {
    storage: { ...storage, initializeStorage, connect },
    registry: { ...registry, initializeRegistry, register },
  };
}

async function setupContracts(wallet: WalletUnlocked) {
  const registry = RegistryContractAbi__factory.connect(
    registryContract,
    wallet
  );
  const storage = StorageContractAbi__factory.connect(storageContract, wallet);
  const testCaller = TestContractAbi__factory.connect(testContract, wallet);

  const register = async (
    domain: string,
    _account: string,
    calculateAmount = true
  ) => {
    const amount = domainPrices(domain);
    const callBuilder = registry.functions.register(
      domain,
      wallet.address.toB256()
    );

    if (calculateAmount) {
      callBuilder.callParams({
        forward: { amount, assetId: BaseAssetId },
      });
    }

    return callBuilder.addContracts([storage]).txParams(txParams).call();
  };

  const initializeRegistry = async () => {
    const { transactionResult: txRegistry } = await registry.functions
      .constructor(
        {
          value: wallet.address.toB256(),
        },
        {
          value: storageContract,
        }
      )
      .txParams(txParams)
      .call();

    return { txRegistry };
  };

  const initializeStorage = async () => {
    const { transactionResult: txProxy } = await storage.functions
      .constructor(
        {
          value: wallet.address.toB256(),
        },
        {
          value: registryContract,
        }
      )
      .txParams(txParams)
      .call();

    return { txProxy };
  };

  return {
    registry: { ...registry, initializeRegistry, register },
    storage: { ...storage, initializeStorage },
    testCaller,
  };
}

function createWallet(
  provider: Provider,
  privateKey = WALLET_PRIVATE_KEYS.MAIN
) {
  return Wallet.fromPrivateKey(privateKey, provider);
}

function randomName(size = 10) {
  const name = (Math.random() + 2).toString(32).substring(2);
  return `${name}`.slice(0, size);
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
