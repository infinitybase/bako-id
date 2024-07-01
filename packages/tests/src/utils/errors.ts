export const tryExecute = <T>(callback: Promise<T>) =>
  new Promise<T>((resolve) => callback.then(resolve).catch(resolve));

export const containLogError = (logs: unknown[], value: unknown) =>
  !!logs.find((_value) => _value === value);

export const expectErrorInstance = (expectedError: unknown, error: unknown) =>
  expect(expectedError).toBeInstanceOf(error);

export const expectContainLogError = (error: unknown, value: unknown) =>
  // @ts-ignore
  expect(containLogError(error.metadata.logs, value)).toBeTruthy();

export const expectRequireRevertError = (expectedError: unknown) =>
  // @ts-ignore
  expect(expectedError.code).toMatch(/revert/);
