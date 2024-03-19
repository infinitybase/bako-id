import { useMutation } from '@tanstack/react-query';
import { Domain as IDomain, resolver } from '@bako-id/sdk';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Center,
  useToast,
} from '@chakra-ui/react';
import { DomainCard, GoBack } from '../components/helpers';

const Domain = () => {
  const { domain } = useParams({ strict: false })
  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });
  const [data, setData] = useState<IDomain | null>(null)
  const toast = useToast()

  useEffect(() => {
    resolveDomainMutation.mutateAsync({
      domain,
      providerURL: "https://beta-5.fuel.network/graphql"
    }).then(data => setData(data))
  }, [])

  const copy = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!data?.owner) return

    toast({
      title: 'Copied',
      status: 'success',
      duration: 1000,
      isClosable: true,
    })

    if(e.currentTarget.id === "resolver") {
      navigator.clipboard.writeText(data.resolver);
      return
    }
    navigator.clipboard.writeText(data.owner);
  }

  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <Center w="full" h="full">
        <DomainCard domain={data} copy={copy} />
      </Center>
    </Center>
  )
}

export { Domain }
