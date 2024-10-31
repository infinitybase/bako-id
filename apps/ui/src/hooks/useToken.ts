import { tokenInfo } from '@bako-id/sdk';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const useToken = () => {
  const { domain } = useParams({ strict: false });

  const { data } = useQuery({
    queryKey: ['token', domain],
    queryFn: () => tokenInfo(domain),
    enabled: !!domain,
  });

  return {
    token: data,
  };
};
