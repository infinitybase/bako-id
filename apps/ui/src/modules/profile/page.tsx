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
  const { domain, domainParam, isLoadingDomain, owner } = useProfile();
  const { page } = useSearch({
    strict: false,
  });
  const isHandle = !isB256(domainParam);
  const { orders, isLoading: isLoadingOrders } = useListOrdersByAccount({
    account: isHandle ? owner?.Address?.bits : domainParam.toLowerCase(),
    page: page || undefined,
  });

  const userWithDomain = !!domain;

  const SkeletonComponent = isHandle
    ? ProfileCardLoadingSkeleton
    : ProfileWithoutHandlerSkeleton;

  if (isLoadingDomain || isLoadingOrders) {
    return (
      <ProfileContainer>
        <SkeletonComponent />
      </ProfileContainer>
    );
  }

  return (
    <>
      {userWithDomain ? (
        <ProfileWithHandler
          orders={orders}
          domain={domain.Address?.bits || domain.ContractId?.bits || ''}
          domainParam={domainParam}
          isLoadingDomain={isLoadingDomain}
          owner={owner?.Address?.bits || owner?.ContractId?.bits || ''}
        />
      ) : (
        <ProfileWithoutHandler orders={orders} />
      )}
    </>
  );
};

export { Profile };
