---
outline: deep
---

# Resolver
This method allows you to obtain the resolver and owner of a identity on the Fuel network, essential for verifying 
ownership and querying identity information.

## Obtaining Resolver via Provider URL
Demonstrates how to use the resolver method to access data from a identity using the URL of a specific provider, 
facilitating the querying of identity information.

```ts
import { resolver } from '@fuel-domains/sdk';

const providerURL = 'https://beta-5.fuel.network/graphql';

// Get domain resolver
const domain = await resolver({
  domain: '@bako_user',
  providerURL,
});
console.log(domain);
```

## Wallet
This code snippet illustrates how to perform a identity resolver query using a wallet as a parameter.

```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: '@bako_user',
  account: wallet,
});
```

## Using a Provider
Here, we demonstrate how to use the resolver method with a provider directly. This approach allows interaction with
identity using a specific service provider, facilitating integration with different infrastructures within the Fuel network.

```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: '@bako_user',
  provider,
});
```
