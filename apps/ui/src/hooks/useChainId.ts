import { type UseNamedQueryParams, useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';

type UseChainParams<TName extends string, TData> = {
  /**
   * Additional query parameters to customize the behavior of `useNamedQuery`.
   */
  query?: UseNamedQueryParams<TName, TData, Error, TData>;
};

export const useChainId = (
  params?: UseChainParams<'chainId', number | null>,
) => {
  const { provider } = useProvider();

  const { data, ...rest } = useQuery({
    queryKey: ['chainId', provider?.url],
    queryFn: async () => {
      try {
        const currentFuelChain = await provider?.getChainId();
        return currentFuelChain ?? null;
      } catch (_error: unknown) {
        console.log(_error);
        return null;
      }
    },
    placeholderData: null,
    enabled: !!provider,
    ...params?.query,
  });

  return {
    chainId: data,
    ...rest,
  };
};
