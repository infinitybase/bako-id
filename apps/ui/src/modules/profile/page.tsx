import { ProfileCardLoadingSkeleton } from './components/profileCardLoadingSkeleton';
import ProfileContainer from './components/profileContainer';
import ProfileWithHandler from './components/profileWithHandler';
import ProfileWithoutHandler from './components/profileWithoutHandler';
import { useProfile } from './hooks/useProfile';

const Profile = () => {
  const { domain, domainParam, isLoadingDomain, owner } = useProfile();

  const userWithDomain = !!domain;

  if (isLoadingDomain) {
    return (
      <ProfileContainer>
        <ProfileCardLoadingSkeleton />
      </ProfileContainer>
    );
  }

  return (
    <>
      {userWithDomain ? (
        <ProfileWithHandler
          domain={domain.Address?.bits || domain.ContractId?.bits || ''}
          domainParam={domainParam}
          isLoadingDomain={isLoadingDomain}
          owner={owner?.Address?.bits || owner?.ContractId?.bits || ''}
        />
      ) : (
        <ProfileWithoutHandler />
      )}
    </>
  );
};

export { Profile };
