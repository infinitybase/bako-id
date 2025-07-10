import { useSearch } from '@tanstack/react-router';
import ProfileWithHandler from './components/profileWithHandler';
import ProfileWithoutHandler from './components/profileWithoutHandler';
import { useListOrdersByAddress } from '@/hooks/marketplace/useListOrdersByAddress';
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
  } = useListOrdersByAddress({
    sellerAddress: isHandle ? owner?.Address?.bits : domainParam.toLowerCase(),
    limit: 1,
    page: page ?? 0,
  });

  const data = orders?.data ?? [];

  const SkeletonComponent = isHandle
    ? ProfileCardLoadingSkeleton
    : ProfileWithoutHandlerSkeleton;

  if (isLoadingDomain || !domainMethods.isFetched || isLoadingOrders) {
    return (
      <ProfileContainer>
        <SkeletonComponent />
      </ProfileContainer>
    );
  }

  const userWithDomain = !!domain;

  return (
    <>
      {userWithDomain ? (
        <ProfileWithHandler
          orders={data}
          domain={domain}
          domainParam={domainParam}
          isFetchingOrders={isLoadingOrders || isPlaceholderData}
          owner={owner?.Address?.bits || owner?.ContractId?.bits || ''}
          paginationInfos={{
            totalPages: orders?.totalPages ?? 0,
            hasNextPage: orders?.hasNextPage ?? false,
            hasPreviousPage: orders?.hasPreviousPage ?? false,
          }}
        />
      ) : (
        <ProfileWithoutHandler
          orders={data}
          isLoadingOrders={isLoadingOrders || isPlaceholderData}
          paginationInfos={{
            totalPages: orders?.totalPages ?? 0,
            hasNextPage: orders?.hasNextPage ?? false,
            hasPreviousPage: orders?.hasPreviousPage ?? false,
          }}
        />
      )}
    </>
  );
};

export { Profile };
