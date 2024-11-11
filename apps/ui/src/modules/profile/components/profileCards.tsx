import { Flex, Stack } from '@chakra-ui/react';
import { Suspense } from 'react';
import { AddressesCard } from '../../../components/card/addressesCard.tsx';
import { OwnershipCard } from '../../../components/card/ownershipCard.tsx';
import { ProfileCard } from '../../../components/card/profileCard.tsx';
import { AccountsCard } from '../../../components/card/accountsCard.tsx';
import { ProfileCardLoadingSkeleton } from './profileCardLoadingSkeleton.tsx';

import { EditMetadataModal } from '../../../components/modal/editProfileModal.tsx';
import { useMetadata } from '../../../hooks/useMetadata.ts';
import { useProvider } from '@fuels/react';
import { getExplorer } from '../../../utils/getExplorer.ts';

type ProfileCardsProps = {
  domainParam: string;
  domain: string;
  owner: string;
  isLoading: boolean;
};

export const ProfileCards = ({
  domain,
  domainParam,
  isLoading: loadingDomain,
  owner,
}: ProfileCardsProps) => {
  const { metadataModal, metadata, setUpdatedMetadata, loadingMetadata } =
    useMetadata();

  const loading = loadingDomain || loadingMetadata;

  const { provider } = useProvider();
  const explorerUrl = getExplorer(provider?.getChainId());

  return loading || !owner ? (
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
            <OwnershipCard
              owner={owner ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />

            <AddressesCard
              domain={domain ?? ''}
              explorerUrl={`${explorerUrl}/account/`}
            />
          </Stack>
        </Flex>
        <AccountsCard metadata={metadata} addAction={metadataModal.onOpen} />
      </Stack>
    </Suspense>
  );
};
