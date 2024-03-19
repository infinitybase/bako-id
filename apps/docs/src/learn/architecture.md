---
layout: doc
title: Architecture
---

# Smart Contracts
Bako ID has 2 contracts for its core functioning, these contracts are one responsible for registering and searching
the handler `Register`  and another for the storage of its handlers `Storage`.

## Storage Contract
This contract was conceived in a more abstract way to consider how the handler can be stored and, primarily, to ensure
that it will never be lost even with updates.

The security of this contract is guaranteed through validations, which allow only the owner of this contract and its
implementation to execute the methods.

<ContractDeployment name="storage" />

## Registry contract
The registry, in a nutshell, is like the layer that allows interaction with the handlers, it allows to register a 
handler and perform a search by its name.

These methods make the call in storage, both to validate if the handler exists when creating and for the search.

<ContractDeployment name="register" />

## Methods execution
When executing the Registry contract method, a series of processing is carried out, from byte conversion 
to method call validations.


In the demonstration below, we briefly explain how the execution process of the `register` method works.
![Register explanation](/register-example.svg)

And here is a brief explanation of the `resolver` method.
![Resolver explanation](/resolver-example.svg)
