import { bn } from 'fuels';
import {
  assertValidDomain,
  domainPrices,
  domainToBytes,
  isValidDomain,
} from './domain';
import { InvalidDomainError } from './errors';

describe('Domain utils', () => {
  test('Domain validations', () => {
    const validDomain = isValidDomain('@valid_domain');
    expect(validDomain).toBeTruthy();

    const invalidDomains = [
      isValidDomain('@invalid!domain'),
      isValidDomain('invalid domain'),
      isValidDomain('invalid@domain'),
      isValidDomain('invalid domain-'),
    ];

    const expectValue = invalidDomains.every((value) => value === false);
    expect(expectValue).toBeTruthy();
  });

  test('Domain name value', () => {
    const validDomain = assertValidDomain('@domain');
    expect(validDomain).toBeDefined();
    expect(validDomain).not.toContain('@');

    const invalidDomain = () => assertValidDomain('invalid@domain');
    expect(invalidDomain).toThrow(InvalidDomainError);
  });

  test('Domain price validation', () => {
    const getDomainPrice = (domain: string) =>
      domainPrices(assertValidDomain(domain));

    const threeChars = getDomainPrice('@now');
    const fourChars = getDomainPrice('@noww');
    const fiveChars = getDomainPrice('@nowww');

    expect(threeChars.eq(bn.parseUnits('0.1'))).toBeTruthy();
    expect(fourChars.eq(bn.parseUnits('0.01'))).toBeTruthy();
    expect(fiveChars.eq(bn.parseUnits('0.001'))).toBeTruthy();
  });

  test('Domain to bytes', () => {
    const domain = 'domain';
    const domainInBytes = [100, 111, 109, 97, 105, 110];

    const domainBytes = domainToBytes(domain);
    const expectedBytes = Uint8Array.from(domainInBytes);

    expect(domainBytes).toEqual(expectedBytes);
  });
});
