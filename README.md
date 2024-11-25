![twitter](https://img.shields.io/twitter/follow/bakoidentity?style=social)

# 📦 Bako ID SDK

Bako ID SDK enable to register a `@` handler domain in [Fuel Network](https://www.fuel.network/).

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
import { BakoIDClient } from '@bako-id/sdk';
import { Provider } from 'fuels';

const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
const client = new BakoIDClient(provider.url);

const resolverAddress = await client.resolver('bakoid'); 
console.log(resolverAddress); // 0x000000...
```

### Resolving a domain name

```ts
import { BakoIDClient } from '@bako-id/sdk';
import { Provider } from 'fuels';

const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
const client = new BakoIDClient(provider.url);

const name = await client.name('0x000000...'); 
console.log(name); // @bakoid
```

## 📜 License

This repo is licensed under the `Apache-2.0` license. See [`LICENSE`](./LICENSE) for more information.
