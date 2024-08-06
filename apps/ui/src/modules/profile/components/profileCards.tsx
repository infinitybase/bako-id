import { UserMetadataContract } from '@bako-id/sdk';
import { Flex, Stack } from '@chakra-ui/react';
import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AccountsCard } from '../../../components/card/accountsCard';
import { AddressesCard } from '../../../components/card/addressesCard';
import { OwnershipCard } from '../../../components/card/ownershipCard';
import { ProfileCard } from '../../../components/card/profileCard';
import { ProfileCardSkeleton } from '../../../components/skeletons';
import { AccountsCardSkeleton } from '../../../components/skeletons/accountsCardSkeleton';
import { AddressCardSkeleton } from '../../../components/skeletons/addressCardSkeleton';
import { OwnershipCardSkeleton } from '../../../components/skeletons/ownershipCardSkeleton';

type ProfileCardsProps = {
  domainParam: string;
  domain: string;
  owner: string;
  isLoading: boolean;
};

export const ProfileCards = ({
  domain,
  domainParam,
  isLoading,
  owner,
}: ProfileCardsProps) => {
  const LoadingData = () => (
    <Suspense>
      <Stack
        display="flex"
        h="fit-content"
        spacing={6}
        direction={['column', 'column', 'column', 'row']}
        w="full"
      >
        <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
          <ProfileCardSkeleton />

          <Stack
            w="full"
            h="full"
            direction={['column', 'column', 'column', 'row']}
            gap={[4, 4, 4, 6]}
          >
            <OwnershipCardSkeleton />
            <AddressCardSkeleton />
          </Stack>
        </Flex>
        <AccountsCardSkeleton />
      </Stack>
    </Suspense>
  );

  const LoadedData = () => {
    const { domain: domainName } = useParams({ strict: false });
    const { wallet } = useWallet();
    const { data: metadata } = useQuery({
      queryKey: ['getAllMetadatas'],
      queryFn: async () => {
        if (!wallet) return;

        const userMetadata = UserMetadataContract.initialize(
          wallet,
          domainName,
        );

        return userMetadata.getAll();
      },
      enabled: !!wallet && !!domainName,
    });


    return (
      <Suspense>
        <Stack
          display="flex"
          h="fit-content"
          spacing={6}
          direction={['column', 'column', 'column', 'row']}
          w="full"
        >
          <Flex w="full" h="full" flexDirection="column" gap={[4, 4, 4, 6]}>
            <ProfileCard
              domainName={domainParam}
              domain={domain ?? ''}
              metadata={metadata}
            />

            <Stack
              w="full"
              h="full"
              direction={['column', 'column', 'column', 'row']}
              gap={[4, 4, 4, 6]}
            >
              <OwnershipCard owner={owner ?? ''} />

              <AddressesCard domain={domain ?? ''} />
            </Stack>
          </Flex>
          <AccountsCard metadata={metadata} />
        </Stack>
      </Suspense>
    );
  };

  return isLoading ? <LoadingData /> : <LoadedData />;
};
