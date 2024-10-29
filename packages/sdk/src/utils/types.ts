export type Enum<T> = {
  [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export type Identity = {
  ContractId: { bits: string };
  Address: { bits: string };
};
