---
sidebar: false
---

# Getting started

Install our **SDK** with your package manager: 

```bash
# NPM
npm install @fuel-domains/sdk

# PNPM
pnpm install @fuel-domains/sdk
```

---

# Resolver

This method get the `resolver` and `owner` of the domain.


## Provider url
```ts
import { resolver } from '@fuel-domains/sdk';

const providerURL = 'https://beta-5.fuel.network/graphql';

// Get domain resolver
const fuelDomain = await resolver({
  domain: 'fueldomain',
  providerURL,
});
console.log(fuelDomain);
```

## Wallet
```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: 'fueldomain',
  account: wallet,
});
```

## Provider
```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: 'fueldomain',
  provider,
});
```
