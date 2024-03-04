import { useMutation } from '@tanstack/react-query';
import { Domain as IDomain, resolver } from '@fuel-domains/sdk';
import { useParams } from '@tanstack/react-router';
import { useFuelConnect } from '../hooks';
import { useEffect, useState } from 'react';

const Domain = () => {
  const { wallet } = useFuelConnect();
  const { domain } = useParams({ strict: false })
  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });
  const [data, setData] = useState<IDomain | null>(null)

  useEffect(() => {
    resolveDomainMutation.mutateAsync({
      domain,
      providerURL: wallet!.provider.url
    }).then(data => setData(data))
  }, [])

  return (
    <div>
      <p>{data?.name}</p>
      <p>{data?.resolver}</p>
    </div>
  )
}

export { Domain }
