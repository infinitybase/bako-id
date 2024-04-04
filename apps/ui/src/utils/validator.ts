import type { Domains } from '../types';

const validateDomain = (domain: string, domainsList: Domains[]): string => {
  if (domain.length > 0) {
    // Check for characters min length
    const minLength = 3;
    if (domain.length < minLength)
      return `Domain must contain at least ${minLength} characters`;

    // Check for invladid characters
    const lettersAndNumbers: RegExp = /^[a-zA-Z0-9]+$/;
    if (!lettersAndNumbers.test(domain))
      return 'Domain must contain only letters and numbers';

    // Check for duplicated domains on current list
    const duplicated = domainsList.find(({ name }) => name === domain);
    if (duplicated) return 'Duplicated domain.';
  }

  return '';
};

export { validateDomain };
