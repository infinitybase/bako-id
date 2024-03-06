import { Center, useToast } from '@chakra-ui/react';
import { useFuelConnect } from '../hooks';
import { register, resolver } from '@fuel-domains/sdk';
import { GoBack } from '../components/helpers';
import { useNavigate, useParams } from '@tanstack/react-router';
import { SetPeriod } from '../components/buy';
import { useMutation } from '@tanstack/react-query';

const checkDomain = (domain: string) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(domain);
};

export const Buy = () => {
  const { wallet } = useFuelConnect();
  const { domain } = useParams({ strict: false })
  const toast = useToast()
  const navigate = useNavigate()

  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });

  const registerDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: register
  });

  const handleConfirmDomain = async () => {
    const isValid = checkDomain(domain);
    if (!isValid) return;

    const info = await resolveDomainMutation.mutateAsync({
      domain,
      providerURL: wallet!.provider.url
    })

    console.debug(info?.name)
    return info
  }

  const handleBuyDomain = async () => {
    const isValid = checkDomain(domain);
    if (!isValid || !wallet) return;

    registerDomainMutation.mutate({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain
    }, {
      onSuccess: async () => {
        await handleConfirmDomain();
        // domainDetailsDialog.onOpen();
        toast({
          title: 'Success!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        navigate({ to: '/checkout/$domain', params: { domain: domain }, startTransition: true }).then()
      },
      onError: console.log
    });
  };

  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <SetPeriod domain={domain} networkFee={0.003872} onSubmit={handleBuyDomain} name={domain} isLoading={resolveDomainMutation.isPending || registerDomainMutation.isPending} walletExists={!!wallet} />
    </Center>
  )
}
