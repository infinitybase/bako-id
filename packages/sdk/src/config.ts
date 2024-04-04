import contractsId from './types/contract-ids.json';

const envrionment = {
  STORAGE_CONTRACT_ID: process.env.STORAGE_ID,
  REGISTRY_CONTRACT_ID: contractsId.registryContract,
};

export { envrionment };
