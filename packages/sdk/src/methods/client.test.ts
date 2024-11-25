import { Address } from 'fuels';
import { BakoIDClientMock } from '../test';

describe('Client', () => {
  const client = new BakoIDClientMock('http://localhost:4000');
  const owner = Address.fromRandom();
  const names = ['@bakoid', '@bakoid2', '@bakoid3'];

  it('should register a new domain', async () => {
    const [primaryName] = names;
    await client.register({
      period: 10,
      domain: primaryName,
      owner: owner.toB256(),
      transactionId: '0x123',
      resolver: owner.toB256(),
    });

    const records = await client.records(owner.toB256());
    expect(records.length).toBe(1);
  });

  it('should resolve a domain', async () => {
    const [, domain] = names;
    await client.register({
      period: 10,
      domain,
      owner: owner.toB256(),
      transactionId: '0x123',
      resolver: owner.toB256(),
    });

    const address = await client.resolver(domain);
    expect(address).toBe(owner.toB256());
  });

  it('should resolve a name', async () => {
    const [primaryName] = names;
    const name = await client.name(owner.toB256());
    expect(name).toBe(primaryName);
  });

  it('should get records', async () => {
    const records = await client.records(owner.toB256());
    expect(records.length).toBe(2);
  });

  it('should get records with empty owner', async () => {
    const records = await client.records('0x');
    expect(records.length).toBe(0);
  });

  it('should correctly parse address', async () => {
    const address = Address.fromRandom();
    const domain = '@testaddress';
    await client.register({
      domain,
      period: 10,
      transactionId: '0x123',
      owner: address.toString(),
      resolver: address.toString(),
    });

    const name = await client.name(address.toString());
    expect(name).toBe('@testaddress');

    const records = await client.records(address.toString());
    expect(records.length).toBe(1);
  });
});
