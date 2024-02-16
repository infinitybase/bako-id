import { FuelDomainOutput } from './contracts/RegistryContractAbi';

export * from './contracts';

export type Nullable<T> = T | null;

export type Domain = FuelDomainOutput & {
  name: string;
}

export type ResolverReturn = Promise<Nullable<Domain>>
