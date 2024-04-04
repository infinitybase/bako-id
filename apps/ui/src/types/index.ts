import type { ReactElement } from 'react';

export enum Coin {
  USD = 'USD',
  ETH = 'ETH',
}

export interface Domains {
  name: string;
  period: number;
}

export interface IChildren {
  children?: ReactElement | ReactElement[];
}
