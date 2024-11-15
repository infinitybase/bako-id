![twitter](https://img.shields.io/twitter/follow/fuel_domains?style=social)
![Waitlist](https://img.shields.io/badge/Fuel_Domais-Waitlist-green?link=https%3A%2F%2Ffuel.domains)


# 📦 Bako ID SDK

Bako ID SDK enable to register a `@` handler domain in [Fuel Network](https://www.fuel.network/).
Compatible with BETA-5

## Installation

#### Pnpm
```bash
pnpm install fuels @bako-id/sdk
```

#### Npm
```bash
npm install fuels @bako-id/sdk
```

#### Yarn
```bash
yarn install fuels @bako-id/sdk
```

## Getting Started

### Resolving a domain address

```ts
import { OffChainSync } from '@bako-id/sdk';
import { Provider } from 'fuels';

const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
const sync = await OffChainSync.create(provider);

const resolverAddress = sync.getResolver('bakoid'); 
console.log(resolverAddress); // 0x000000...
```

### Resolving a domain name

```ts
import { OffChainSync } from '@bako-id/sdk';
import { Provider } from 'fuels';

const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
const sync = await OffChainSync.create(provider);

const name = sync.getDomain('0x000000...'); 
console.log(name); // @bakoid
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
