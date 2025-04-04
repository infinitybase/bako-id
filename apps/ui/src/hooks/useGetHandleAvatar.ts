import { useQuery } from '@tanstack/react-query';
import { useMetadata } from './useMetadata';
import { MetadataKeys } from '@bako-id/sdk';

export const useGetHandleAvatar = () => {
  const { metadata } = useMetadata();

  const avatarUrl = metadata?.find((m) => m.key === MetadataKeys.AVATAR)?.value;

  return useQuery({
    queryKey: ['getHandleAvatar'],
    queryFn: async () => {
      const response = await fetch(avatarUrl!, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Something went wrong while searching for avatar: ${errorData.error}`
        );
        return null;
      }

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    enabled: !!avatarUrl,
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });
};
