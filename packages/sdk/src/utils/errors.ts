import type { FuelError } from '@fuel-ts/errors';
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

/**
 * Represents an error that occurs when an account is not the owner of the handle.
 *
 * @class
 * @extends
 * @name NotOwnerError
 */
export class NotOwnerError extends Error {
  constructor() {
    super('Account is not the owner of the handle.');
    this.name = 'NotOwnerError';
  }
}

export class InvalidHandleError extends Error {
  constructor() {
    super('Invalid domain or already registered.');
    this.name = 'InvalidDomain';
  }
}

export class SameResolverError extends Error {
  constructor() {
    super('The resolver is the same as the current resolver.');
    this.name = 'SameResolverError';
  }
}

export const containLogError = (logs: unknown[], value: unknown) =>
  !!logs.find((_value) => _value === value);

export const expectRequireRevertError = (expectedError: unknown) =>
  // @ts-ignore
  expect(expectedError.code).toMatch(/revert/);

export const expectContainLogError = (error: unknown, value: unknown) =>
  // @ts-ignore
  expect(containLogError(error.metadata.logs, value)).toBeTruthy();

const errors = {
  NotOwner: NotOwnerError,
  InvalidDomain: InvalidHandleError,
  SameResolver: SameResolverError,
  NotFoundBalanceError: NotFoundBalanceError,
  Default: Error,
};

const getError = (error: string) => errors[error] ?? errors.Default;
export const getContractError = (error: FuelError) => {
  if (error.metadata.logs) {
    const errorTypes = Object.keys(errors);
    const errorValue = errorTypes.find((errorType) =>
      (error.metadata.logs as unknown[]).includes(errorType),
    );

    if (errorValue) {
      const ErrorClass = getError(errorValue);
      throw new ErrorClass();
    }
  }
};
