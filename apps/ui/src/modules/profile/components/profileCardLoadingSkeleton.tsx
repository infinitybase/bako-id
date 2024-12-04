import { Suspense } from 'react';
import { ProfileCardSkeleton } from '../../../components/skeletons';
import { AccountsCardSkeleton } from '../../../components/skeletons/accountsCardSkeleton';
import { AddressCardSkeleton } from '../../../components/skeletons/addressCardSkeleton';
import { OwnershipCardSkeleton } from '../../../components/skeletons/ownershipCardSkeleton';
import { Flex, Stack } from '@chakra-ui/react';

const ProfileCardLoadingSkeleton = () => (
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

export { ProfileCardLoadingSkeleton };
