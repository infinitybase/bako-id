import { Resolver, getContractId } from '@bako-id/contracts';
import type { Account, Provider } from 'fuels';
import { type Enum, type Identity, assertValidDomain } from '../utils';

export class ResolverContract {
  private contract: Resolver;
  private provider: Provider;

  constructor(id: string, accountOrProvider: Account | Provider) {
    this.contract = new Resolver(id, accountOrProvider);
    this.provider = this.contract.provider;
  }

  static create(account: Account | Provider) {
    let provider: Provider;
    if ('provider' in account) {
      provider = account.provider;
    } else {
      provider = account;
    }
    const contractId = getContractId(provider.url, 'resolver');
    return new ResolverContract(contractId, account);
  }

  async addr(domain: string) {
    const domainName = assertValidDomain(domain);
    const { value } = await this.contract.functions.addr(domainName).get();
    return value;
  }

  async owner(domain: string) {
    const domainName = assertValidDomain(domain);
    const { value } = await this.contract.functions.owner(domainName).get();
    return value;
  }

  async name(addr: string) {
    let resolverInput: Enum<Identity>;
    const type = await this.provider.getAddressType(addr);
    if (type === 'Contract') {
      resolverInput = { ContractId: { bits: addr } };
    } else if (type === 'Account') {
      resolverInput = { Address: { bits: addr } };
    } else {
      throw new Error('Invalid resolver type');
    }
    const { value } = await this.contract.functions.name(resolverInput).get();
    return value;
  }
}
