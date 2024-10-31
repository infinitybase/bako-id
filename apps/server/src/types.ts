export type AttestationHash = string;
export type AttestationKey = string;

type AppTypes = 'farcaster';

export type AttestationData = {
  id: string;
  app: AppTypes;
  handle: string;
  address: string;
};
