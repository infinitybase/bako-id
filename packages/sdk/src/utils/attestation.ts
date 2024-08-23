import { hashMessage } from 'fuels';

type AttestationHash = string;
// type AttestationKey = string;

type GenerateHashData = {
  id: string;
  app: string;
  handle: string;
};
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Attestation {
  static generateHash({ id, app, handle }: GenerateHashData): AttestationHash {
    return hashMessage(id + app + handle);
  }

  // static generateKey(): AttestationKey {}
}
