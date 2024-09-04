![twitter](https://img.shields.io/twitter/follow/fuel_domains?style=social)
![Waitlist](https://img.shields.io/badge/Fuel_Domais-Waitlist-green?link=https%3A%2F%2Ffuel.domains)


# 📦 Bako ID SDK

Bako ID SDK enable to register a `@` handle domain in [Fuel Network](https://www.fuel.network/).
Compatible with BETA-5

## Installation

```bash
npm install fuels @bako-id/sdk
```

## Getting Started

### Domain resolver
```ts
import { resolver } from '@bako-id/sdk';

const providerURL = 'https://testnet.fuel.network/v1/graphql';

// Get Bako handle resolver
const fuelDomain = await resolver('@my_domain');
console.log(fuelDomain); // { owner: '0x000...', resolver: '0x000...' }
```

### Domain register
```ts
import { register } from '@bako-id/sdk';
import { Wallet } from 'fuels';

// Fuel Wallet instance
const wallet: Wallet;

// Register a Bako handle 
await register({
  account: wallet,
  resolver: '0x0000...',
  domain: '@my_domain',
});
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
