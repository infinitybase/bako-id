import { useChainId } from '@/hooks/useChainId';
import { Stack } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { NftCollections } from './nft/NftCollections';
import { NftListForSale } from './nft/NftListForSale';
import ProfileContainer from './profileContainer';

export default function ProfileWithoutHandler() {
  const { chainId } = useChainId();
  const { domain: domainParam } = useParams({ strict: false });

  const address = domainParam.toLowerCase();

  return (
    <ProfileContainer>
      <Stack w="full" gap={6}>
        <NftListForSale address={address} />

        <NftCollections resolver={address} chainId={chainId} />
      </Stack>
    </ProfileContainer>
  );
}
