import { RequireRevertError } from 'fuels';

export const tryExecute = <T>(callback: Promise<T>) =>
  new Promise<T>((resolve) => callback.then(resolve).catch(resolve));

export const containLogError = (logs: unknown[], value: unknown) =>
  !!logs.find((_value) => _value === value);

export const expectContainLogError = (logs: unknown[], value: unknown) =>
  expect(containLogError(logs, value)).toBeTruthy();

export const expectErrorInstance = (expectedError: unknown, error: unknown) =>
  expect(expectedError).toBeInstanceOf(error);

export const expectRequireRevertError = (expectedError: unknown) =>
  expect(expectedError).toBeInstanceOf(RequireRevertError);
