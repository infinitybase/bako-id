import { useSearch } from '@tanstack/react-router';
import ProfileWithHandler from './components/profileWithHandler';
import ProfileWithoutHandler from './components/profileWithoutHandler';
import { useListOrdersByAddress } from '@/hooks/marketplace/useListOrdersByAddress';
import { useMemo } from 'react';
import { useProfile } from './hooks/useProfile';
import { isB256 } from 'fuels';
import { ProfileCardLoadingSkeleton } from './components/profileCardLoadingSkeleton';
import ProfileWithoutHandlerSkeleton from './components/profileWithoutHandleSkeleton';
import ProfileContainer from './components/profileContainer';

const Profile = () => {
  const { domain, domainParam, isLoadingDomain, owner, domainMethods } =
    useProfile();
  const { page } = useSearch({ strict: false });
  const isHandle = !isB256(domainParam);

  const {
    orders,
    isLoading: isLoadingOrders,
    isPlaceholderData,
    isFetchingNextPage,
  } = useListOrdersByAddress({
    sellerAddress: isHandle ? owner?.Address?.bits : domainParam.toLowerCase(),
    limit: 10,
    page: page ?? 0,
  });

  const SkeletonComponent = isHandle
    ? ProfileCardLoadingSkeleton
    : ProfileWithoutHandlerSkeleton;

  if (isLoadingDomain || !domainMethods.isFetched) {
    return (
      <ProfileContainer>
        <SkeletonComponent />
      </ProfileContainer>
    );
  }

  const data = useMemo(
    () => orders?.pages?.flatMap((page) => page.data) ?? [],
    [orders]
  );

  const userWithDomain = !!domain;

  return (
    <>
      {userWithDomain ? (
        <ProfileWithHandler
          orders={data}
          domain={domain}
          domainParam={domainParam}
          isFetchingOrders={
            isLoadingOrders || isFetchingNextPage || isPlaceholderData
          }
          owner={owner?.Address?.bits || owner?.ContractId?.bits || ''}
          paginationInfos={{
            totalPages: orders?.pages[0]?.totalPages ?? 0,
            hasNextPage: orders?.pages[0]?.hasNextPage ?? false,
            hasPreviousPage: orders?.pages[0]?.hasPreviousPage ?? false,
          }}
        />
      ) : (
        <ProfileWithoutHandler
          orders={data}
          isLoadingOrders={
            isLoadingOrders || isFetchingNextPage || isPlaceholderData
          }
          paginationInfos={{
            totalPages: orders?.pages[0]?.totalPages ?? 0,
            hasNextPage: orders?.pages[0]?.hasNextPage ?? false,
            hasPreviousPage: orders?.pages[0]?.hasPreviousPage ?? false,
          }}
        />
      )}
    </>
  );
};

export { Profile };
