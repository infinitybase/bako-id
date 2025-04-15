export type AttestationHash = string;
export type AttestationKey = string;

type AppTypes = 'farcaster';

export type AttestationData = {
  id: string;
  app: AppTypes;
  handle: string;
  address: string;
};

export type Identity = {
  Address: {
    bits: string;
  };
  ContractId: {
    bits: string;
  };
};

export interface UploaderEventLog {
  file_hash: string;
  handle: string;
  sender: {
    bits: string;
  };
  owner: {
    Address: {
      bits: string;
    };
  };
}
