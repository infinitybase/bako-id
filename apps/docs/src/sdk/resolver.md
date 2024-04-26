---
outline: deep
---

# Resolver
This method allows you to obtain the resolver and owner of a identity on the Fuel network, essential for verifying 
ownership and querying identity information.

## Obtaining Resolver
Demonstrates how to use the resolver method to access data from a identity using the URL of a specific provider, 
provider instance or a account instance.

```ts
import { resolver } from '@bako-id/sdk';
import { Provider, Wallet } from 'fuels';

// Get domain resolver with default provider
const domain = await resolver('@bako_user');

const providerURL = 'https://beta-5.fuel.network/graphql';

// Get domain resolver with Provider URL
const domain = await resolver('@bako_user', {
  providerURL,
});

// Get domain resolver by Provider instance
const provider = await Provider.create('https://beta-5.fuel.network/graphql');
const domain = await resolver('@bako_user', {
  provider,
});

// Or by Account instance
const account = Wallet.fromPrivateKey('<PRIVATE KEY>');
const domain = await resolver('@bako_user', {
  account,
});
```

## Obtaining Name
It's possible to obtain the primary handle through the address of a resolver. When the first handle is purchased, it will be added
as primary to the resolver. In this method, as with `resolver()`, you can search using the url of the Provider,
through its instance, or from a wallet.

```ts
import { resolverName } from '@bako-id/sdk';
import { Provider, Wallet } from 'fuels';

const providerURL = 'https://beta-5.fuel.network/graphql';
const account = Wallet.fromPrivateKey('<PRIVATE KEY>');
const resolver = account.address.toB256();

// Get name resolver with default provider
const domain = await resolverName(resolver);

// Get name with Provider URL
const name = await resolverName(resolver, {
  providerURL,
});

// Get name by Provider instance
const provider = await Provider.create('https://beta-5.fuel.network/graphql');
const name = await resolverName(resolver, {
  provider,
});

// Or by Account instance
const name = await resolverName(resolver, {
  account,
});
```
