import type { Account } from 'fuels';
import { config } from '../../config';
import { MetadataContract } from '../../types';
import { NotOwnerError } from '../../utils';
import { owner } from '../resolver';
import { type Metadata, decodeMetadata } from './utils';

const txParams = {
  gasPrice: 1,
  gasLimit: 1_000_000,
};

export class UserMetadataContract {
  private readonly contract: MetadataContract;
  private readonly handleName: string;
  private readonly account: Account;

  protected constructor(account: Account, handleName: string) {
    this.contract = new MetadataContract(config.METADATA_CONTRACT_ID, account);
    this.handleName = handleName;
    this.account = account;
  }

  /**
   * Initializes a new instance of the UserMetadataContract class.
   *
   * @param {Account} account - The account instance.
   * @param {string} handleName - The handle name for the user metadata.
   * @return {UserMetadataContract} - A new UserMetadataContract object.
   */
  static initialize(account: Account, handleName: string) {
    return new UserMetadataContract(account, handleName);
  }

  /**
   * Saves metadata for the given handle name.
   *
   * @param {Metadata} metadata - The metadata object to save.
   * @throws {NotOwnerError} if the handle owner is not the same as the current account address.
   * @returns {Promise} - A promise that resolves with the result of the save operation.
   */
  async saveMetadata(metadata: Metadata) {
    const ownerAddress = await owner(this.handleName);

    if (ownerAddress && ownerAddress !== this.account.address.toB256()) {
      throw new NotOwnerError();
    }

    const saveFn = await this.contract.functions
      .save(this.handleName, metadata.key, metadata.value)
      .txParams(txParams)
      .call();

    return saveFn.waitForResult();
  }

  /**
   * Saves multiple metadata for the given handle name.
   *
   * @param {Metadata[]} metadata - An array of metadata objects to save.
   * @throws {NotOwnerError} if the handle owner is not the same as the current account address.
   * @returns {Promise} - A promise that resolves with the result of the save operation.
   */
  async batchSaveMetadata(metadata: Metadata[]) {
    const ownerAddress = await owner(this.handleName);

    if (ownerAddress && ownerAddress !== this.account.address.toB256()) {
      throw new NotOwnerError();
    }

    const saveFn = await this.contract
      .multiCall(
        metadata.map((m) =>
          this.contract.functions.save(this.handleName, m.key, m.value)
        )
      )
      .call();

    return saveFn.waitForResult();
  }

  /**
   * Retrieves the metadata for the given key.
   *
   * @param {string} key - The key to retrieve the metadata for.
   * @returns {Promise<Metadata | null>} The metadata object associated with the key, or null if it does not exist.
   */
  async getMetadata(key: string) {
    const { value } = await this.contract.functions
      .get(this.handleName, key)
      .get();

    if (!value) return null;

    return { key, value } as Metadata;
  }

  /**
   * Retrieves all metadata with the specified handle name.
   *
   * @returns {Promise<Array>} - A promise that resolves with an array of metadata objects.
   */
  async getAll() {
    const { value: metadataBytes } = await this.contract.functions
      .get_all(this.handleName)
      .get();

    return decodeMetadata(Array.from(metadataBytes));
  }

  get contractABI() {
    return this.contract;
  }
}

export type { Metadata };
