import { BakoIDClient, RegistryContract, ResolverContract } from '@bako-id/sdk';
import { Box, Center, Flex, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Provider } from 'fuels';
import { AccountsCard } from '../../../components/card/accountsCard.tsx';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
import { getExplorer } from '../../../utils/getExplorer.ts';
import { ProfileCardLoadingSkeleton } from '../components/profileCardLoadingSkeleton.tsx';
import { NFTCollections } from '../components/profileCards.tsx';

const { VITE_PROVIDER_URL, VITE_API_URL } = import.meta.env;

const ProfileExternal = () => {
  const { domain: domainParam, externalDomain } = useParams({ strict: false });
  const domainName = domainParam ?? externalDomain;

  const { data: provider, isLoading: isLoadingProvider } = useQuery({
    queryKey: ['provider', domainName],
    queryFn: async () => Provider.create(VITE_PROVIDER_URL!),
  });

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses', domainName],
    queryFn: async () => {
      const contract = ResolverContract.create(provider!);

      const owner = await contract.owner(domainName);
      const resolver = await contract.addr(domainName);

      return {
        owner: owner?.ContractId?.bits ?? owner?.Address?.bits,
        resolver: resolver?.ContractId?.bits ?? resolver?.Address?.bits,
      };
    },
    enabled: !!provider,
  });

  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ['metadata', domainName],
    queryFn: async () => {
      const client = new BakoIDClient(provider!, VITE_API_URL);
      const contract = RegistryContract.create(provider!, client);
      const metadata = await contract.getMetadata(domainName);
      return Object.entries(metadata).map(([key, value]) => ({
        key,
        value,
      }));
    },
    enabled: !!provider,
  });

  const explorerUrl = getExplorer(provider?.getChainId());
  const { owner, resolver } = addresses ?? {};

  const isLoading =
    isLoadingProvider || isLoadingAddresses || isLoadingMetadata;

  return (
    <Center
      p={{
        base: 3,
        md: 0,
      }}
      overflowY="scroll"
      justifyContent={{
        base: 'flex-start',
        md: 'center',
      }}
      flexDirection="column"
      w="full"
      h="full"
      gap={3}
    >
      {isLoading && (
        <Box w="full" maxW={1019}>
          <ProfileCardLoadingSkeleton />
        </Box>
      )}
      <Stack
        hidden={isLoading}
        direction={{
          base: 'column',
          md: 'row',
        }}
        w="full"
        maxW={1019}
        gap={3}
        alignItems="flex-start"
      >
        <Flex direction={'column'} w="full" gap={3} flex={2}>
          <ProfileCard
            domainName={domainName}
            domain={resolver ?? ''}
            metadata={metadata}
            editAction={() => {}}
          />
          <Stack
            direction={{
              base: 'column',
              sm: 'row',
            }}
            gap={3}
            alignItems="flex-start"
          >
            <OwnershipCard
              h="full"
              owner={owner ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />
            <AddressesCard
              h={'full'}
              domain={resolver ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />
          </Stack>
        </Flex>
        <Box w="full" h="full" flex={1}>
          <AccountsCard metadata={metadata} addAction={() => {}} />
        </Box>
      </Stack>
      <Box maxW={1019} w="full">
        <NFTCollections
          chainId={provider?.getChainId()}
          resolver={resolver ?? ''}
        />
      </Box>
    </Center>
  );
};

export { ProfileExternal };
