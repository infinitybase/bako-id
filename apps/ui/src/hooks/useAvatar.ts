import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';
import { BakoIDClient } from '@bako-id/sdk';
import { useMemo } from 'react';

export const useAvatar = (name?: string) => {
  const { chainId, isLoading } = useChainId();
  const client = useMemo(
    () => new BakoIDClient(import.meta.env.VITE_API_URL),
    [],
  );

  const { data: avatar, ...rest } = useQuery({
    queryKey: ['avatar', name, chainId],
    queryFn: () => {
      if (name) {
        return client.avatar(name, chainId!);
      }
    },
    enabled: !!name && !isLoading,
  });

  return { avatar, ...rest };
};
