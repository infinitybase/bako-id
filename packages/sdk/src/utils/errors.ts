/**
 * Represents an error thrown when a domain contains invalid characters.
 * @extends Error
 */
export class InvalidDomainError extends Error {
  constructor() {
    super('Invalid domain characters.');
    this.name = 'InvalidDomainError';
  }
}

/**
 * Represents an error that occurs when a balance is not found.
 *
 * @class
 * @extends Error
 * @name NotFoundBalanceError
 */
export class NotFoundBalanceError extends Error {
  constructor() {
    super('Balance not found.');
    this.name = 'NotFoundBalanceError';
  }
}
