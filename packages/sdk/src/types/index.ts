import { FuelDomainOutput } from './sway/contracts/RegistryContractAbi';

export * from './sway/contracts';

export type Nullable<T> = T | null;

export type Domain = FuelDomainOutput & {
  name: string;
}

export type ResolverReturn = Promise<Nullable<Domain>>
