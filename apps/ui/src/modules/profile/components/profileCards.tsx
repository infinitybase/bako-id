import { Flex, Stack } from '@chakra-ui/react';
import { Suspense } from 'react';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
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
    // const { domain: domainName } = useParams({ strict: false });
    // const { wallet } = useWallet();
    //
    // const { data: metadata } = useQuery({
    //   queryKey: ['getAllMetadatas'],
    //   queryFn: async () => {
    //     if (!wallet) return;
    //
    //     // const userMetadata = UserMetadataContract.initialize(
    //     //   wallet,
    //     //   domainName,
    //     // );
    //
    //     // return userMetadata.getAll();
    //
    //     return [];
    //   },
    //   enabled: !!wallet && !!domainName,
    // });

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
              owner={owner ?? ''}
              metadata={[]}
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
          {/*<AccountsCard metadata={[]} />*/}
        </Stack>
      </Suspense>
    );
  };

  return isLoading ? <LoadingData /> : <LoadedData />;
};
