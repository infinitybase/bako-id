import { useDomain } from '../../../hooks';

export const useMyHandles = () => {
  const { getAllDomains } = useDomain();

  return {
    ...getAllDomains,
  };
};
