import { useListOrdersByAccount } from '@/hooks/marketplace';
import { useSearch } from '@tanstack/react-router';
import { isB256 } from 'fuels';
import { ProfileCardLoadingSkeleton } from './components/profileCardLoadingSkeleton';
import ProfileContainer from './components/profileContainer';
import ProfileWithHandler from './components/profileWithHandler';
import ProfileWithoutHandlerSkeleton from './components/profileWithoutHandleSkeleton';
import ProfileWithoutHandler from './components/profileWithoutHandler';
import { useProfile } from './hooks/useProfile';

const Profile = () => {
  const { domain, domainParam, isLoadingDomain, owner, domainMethods } =
    useProfile();
  const { page } = useSearch({ strict: false });
  const isHandle = !isB256(domainParam);
  const {
    orders,
    isPlaceholderData,
    isFetched: isOrdersFetched,
  } = useListOrdersByAccount({
    account: isHandle ? owner?.Address?.bits : domainParam.toLowerCase(),
    page: page || undefined,
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

  const userWithDomain = !!domain;

  return (
    <>
      {userWithDomain ? (
        <ProfileWithHandler
          orders={orders}
          domain={domain.Address?.bits || domain.ContractId?.bits || ''}
          domainParam={domainParam}
          isFetchingOrders={isPlaceholderData || !isOrdersFetched}
          owner={owner?.Address?.bits || owner?.ContractId?.bits || ''}
        />
      ) : (
        <ProfileWithoutHandler
          orders={orders}
          isLoadingOrders={!isOrdersFetched || isPlaceholderData}
        />
      )}
    </>
  );
};

export { Profile };
