import { useDomain } from '../../../hooks';

export const useMyHandles = () => {
  const { getAllDomains, resolveName } = useDomain();

  console.log(resolveName.data);

  return {
    ...getAllDomains,
  };
};
