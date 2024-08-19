import contractsId from './types/sway/contract-ids.json';

const config = {
  REGISTRY_CONTRACT_ID: contractsId.registryContract,
  METADATA_CONTRACT_ID: contractsId.metadataContract,
  RESOLVER_CONTRACT_ID: contractsId.resolverContract,
  ATTESTATION_CONTRACT_ID: contractsId.attestationContract,
  STORAGE_CONTRACT_ID: process.env.STORAGE_ID,
  PROVIDER_DEPLOYED: process.env.PROVIDER_URL,
};

export { config };
