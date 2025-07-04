import { AccountsCard } from '@/components/card/accountsCard.tsx';
import { AddressesCard } from '@/components/card/addressesCard.tsx';
import { OwnershipCard } from '@/components/card/ownershipCard.tsx';
import { ProfileCard } from '@/components/card/profileCard.tsx';
import { EditMetadataModal } from '@/components/modal/editProfileModal.tsx';
import { useChainId } from '@/hooks/useChainId';
import { useMetadata } from '@/hooks/useMetadata.ts';
import type { Order } from '@/types/marketplace';
import { getExplorer } from '@/utils/getExplorer.ts';
import type { PaginationResult } from '@/utils/pagination';
import { Flex, Stack } from '@chakra-ui/react';
import { Suspense, useMemo } from 'react';
import { ProfileMarketplaceBanner } from './ProfileMarketplaceBanner.tsx';
import { NftCollections } from './nft/NftCollections.tsx';
import { NftListForSale } from './nft/NftListForSale.tsx';
import { ProfileCardLoadingSkeleton } from './profileCardLoadingSkeleton.tsx';

type ProfileCardsProps = {
  domainParam: string;
  domain: string;
  owner: string;
  orders: PaginationResult<Order> | undefined;
  withHandle: boolean;
  isFetchingOrders?: boolean;
};

export const ProfileCards = ({
  domain,
  domainParam,
  owner,
  orders,
  withHandle,
  isFetchingOrders,
}: ProfileCardsProps) => {
  const { metadataModal, metadata, setUpdatedMetadata, loadingMetadata } =
    useMetadata();

  const loading = loadingMetadata;

  const handleOnSuccess = () => {
    metadataModal.onClose();
    setUpdatedMetadata([]);
  };
  const { chainId } = useChainId();
  const explorerUrl = getExplorer(chainId);

  const isEmptyOrders = useMemo(() => !orders?.data.length, [orders]);
  const showMarketplaceBanner = useMemo(
    () => isEmptyOrders && withHandle && !isFetchingOrders,
    [isEmptyOrders, withHandle, isFetchingOrders]
  );

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
        handleOnSuccess={handleOnSuccess}
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
            isMetadataLoading={loading}
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

      {showMarketplaceBanner && <ProfileMarketplaceBanner />}

      {!isEmptyOrders && (
        <NftListForSale
          domain={domainParam!}
          address={domain}
          isLoadingOrders={isFetchingOrders}
          orders={orders}
        />
      )}

      <NftCollections resolver={domain!} />
    </Suspense>
  );
};
