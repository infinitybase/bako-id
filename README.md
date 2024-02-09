![twitter](https://img.shields.io/twitter/follow/fuel_domains?style=social)
![Waitlist](https://img.shields.io/badge/Fuel_Domais-Waitlist-green?link=https%3A%2F%2Ffuel.domains)


# 📦 Fuel Domains SDK

Fuel Domains SDK enable to register a `.fuel` domain in [Fuel Network](https://www.fuel.network/).
Compatible with BETA-5

## Installation

```bash
npm install fuels @fuel-domains/sdk
```

## Getting Started

### Domain resolver
```ts
import { resolver } from '@fuel-domains/sdk';

const providerURL = 'https://beta-5.fuel.network/graphql';

// Get domain resolver
const fuelDomain = await resolver({
  domain: 'fueldomain',
  providerURL,
});
console.log(fuelDomain); // { owner: '0x000...', resolver: '0x000...' }
```

### Domain register
```ts
import { register } from '@fuel-domains/sdk';
import { Wallet } from 'fuels';

// Fuel Wallet instance
const wallet: Wallet;

// Register a .fuel domain 
await register({
  account: wallet,
  resolver: '0x0000...',
  domain: 'fueldomain',
});
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
