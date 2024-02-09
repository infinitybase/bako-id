---
sidebar: false
---

# What is Fuel Domains?

Fuel Domains is a Name System for the FUEL network. Our primary goal is to establish a secure, stable, and efficient tool that provides all users and projects within this network with access to a high-quality NS protocol

## SDK Installation

To start using the `@fuel-domains` SDK in your application, you need to install it using your preferred package manager.
The installation adds the necessary tools to interact with the name system on the Fuel blockchain network.

```bash
# NPM
npm install @fuel-domains/sdk

# PNPM
pnpm install @fuel-domains/sdk
```

## Resolver
This method allows you to obtain the resolver and owner of a domain on the Fuel network, essential for verifying ownership and querying domain information.

## Obtaining Resolver via Provider URL
Demonstrates how to use the resolver method to access data from a domain using the URL of a specific provider, facilitating the querying of domain information.

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
This code snippet illustrates how to perform a domain resolver query using a wallet as a parameter.

```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: 'fueldomain',
  account: wallet,
});
```

## Using a Provider
Here, we demonstrate how to use the resolver method with a provider directly. This approach allows interaction with domains using a specific service provider, facilitating integration with different infrastructures within the Fuel network.

```ts
import { resolver } from '@fuel-domains/sdk';

const result = await resolver({
  domain: 'fueldomain',
  provider,
});
```
