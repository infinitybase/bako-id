import { Flex, Stack } from '@chakra-ui/react';
import { Suspense } from 'react';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
import { AccountsCard } from '../../../components/card/accountsCard.tsx';
import { ProfileCardLoadingSkeleton } from './profileCardLoadingSkeleton.tsx';

import { EditMetadataModal } from '../../../components/modal/editProfileModal.tsx';
import { useMetadata } from '../../../hooks/useMetadata.ts';

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
  const { metadataModal, metadata, setUpdatedMetadata } = useMetadata();

  return isLoading || !owner ? (
    <ProfileCardLoadingSkeleton />
  ) : (
    <Suspense>
      <EditMetadataModal
        isOpen={metadataModal.isOpen}
        onClose={() => {
          metadataModal.onClose();
          setUpdatedMetadata([]);
        }}
        metadata={metadata}
      />

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
            editAction={metadataModal.onOpen}
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
        <AccountsCard metadata={metadata} addAction={metadataModal.onOpen} />
      </Stack>
    </Suspense>
  );
};
