import { tokenInfo } from '@bako-id/sdk';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { TokenInfo } from '../types';

export const useToken = () => {
  const { domain } = useParams({ strict: false });
  const [token, setToken] = useState<TokenInfo>();

  useEffect(() => {
    const getToken = async () => {
      await tokenInfo(domain).then((token) => setToken(token));
    };

    getToken();
  }, [domain]);

  return {
    token,
  };
};
