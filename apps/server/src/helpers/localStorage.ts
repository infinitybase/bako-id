export const getLocalStorage = <Response = unknown>(
  key: string
): Response | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setLocalStorage = <Response>(
  key: string,
  value: Response
): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
