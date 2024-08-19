import type { FuelError } from '@fuel-ts/errors';
import type { Account, Provider } from 'fuels';
import type { Option } from 'src/types/sway/contracts/common';
import { config } from '../config';
import { AttestationContractAbi__factory } from '../types';
import { getContractError, getProviderFromParams, getTxParams } from '../utils';

type AttestationKey = string;
type AttestationHash = string;

type AttestationApps = 'farcaster';

/**
 * Represents the data required to attest an attestation.
 *
 * @property {string} id - The id of the attestation.
 * @property {AttestationApps} app - The app for which the attestation is being made.
 * @property {string} handle - The handle of the attestation.
 * @example
 * const data = {
 *  id: '0x123',
 *  app: 'farcaster',
 *  handle: 'my_handle',
 * };
 *
 */
type AttestationData = {
  id: string;
  app: AttestationApps;
  handle: string;
};

type AttestParams = {
  data: AttestationData;
  attester: Account;
};

/**
 * Attests an attestation.
 *
 * @param {AttestParams} params - The parameters required to attest an attestation.
 * @throws {FuelError} If the attestation fails.
 * @return {Promise<AttestationHash>} The attestation hash generated by the data passed.
 * @example
 * attest({
 *   data: {
 *     id: '0x123',
 *     app: 'farcaster',
 *     handle: 'my_handle',
 *   },
 *   attester: wallet,
 * });
 */

export async function attest(params: AttestParams): Promise<AttestationHash> {
  const { data, attester } = params;

  // Connect to the attestation contract
  const attestation = AttestationContractAbi__factory.connect(
    config.ATTESTATION_CONTRACT_ID,
    attester,
  );

  const txParams = getTxParams(attester.provider);

  try {
    const attestFn = await attestation.functions
      .attest({
        id: data.id,
        app: data.app,
        handle: data.handle,
      })
      .txParams(txParams)
      .call();

    const { value: attestationHash } = await attestFn.waitForResult();

    return attestationHash;
  } catch (error) {
    throw getContractError(<FuelError>error);
  }
}

type VerifyAttestOptions = {
  account?: Account;
  provider?: Provider;
};

/**
 * Verifies an attestation by attestation key.
 *
 * @param {AttestationKey} key - The attestation key to verify.
 * @param {VerifyAttestOptions} options - The options for the provider.
 * @throws {FuelError} If the attestation verification fails.
 * @return {Promise<Option<AttestationHash>>} The attestation hash if the attestation is verified. If the attestation is not found, it returns undefined.
 *
 * @example
 * verify(attestationKey, {
 *   account: wallet,
 * });
 */
export async function verify(
  key: AttestationKey,
  options: VerifyAttestOptions,
): Promise<Option<AttestationHash>> {
  const { account } = options;

  const provider = await getProviderFromParams({
    provider: options.provider,
    account,
  });

  const attestation = AttestationContractAbi__factory.connect(
    config.ATTESTATION_CONTRACT_ID,
    provider,
  );

  const txParams = getTxParams(provider);

  try {
    const { value: attestationHash } = await attestation.functions
      .verify(key)
      .txParams(txParams)
      .get();

    return attestationHash;
  } catch (error) {
    console.log(error);
    throw getContractError(<FuelError>error);
  }
}
