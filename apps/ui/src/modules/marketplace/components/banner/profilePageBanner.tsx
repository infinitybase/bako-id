import {
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Skeleton,
  Stack,
  VStack,
} from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { VerifiedBadgeIcon } from '../icons/verifiedBadgeIcon';
import { StatBox } from './statBox';
import { AvatarIcon } from '@/components';
import { MetadataKeys } from '@/utils/metadataKeys';
import { useMetadata } from '@/hooks/useMetadata';
import { PoweredByIcon } from '../icons/poweredByIcon';
import profileBanner from '@/assets/marketplace/mktp-profile-banner.png';
import { UnverifiedBadgeIcon } from '../icons/unverifiedBadgeIcon';
import { Link, useNavigate } from '@tanstack/react-router';
import { useResolverName } from '@/hooks/useResolverName';

type ProfilePageBannerProps = {
  name: string;
  nftQuantity: number;
  usdValue: number;
  resolver: string;
};

export const ProfilePageBanner = ({
  name,
  nftQuantity,
  usdValue,
  resolver,
}: ProfilePageBannerProps) => {
  const { data: hasDomain } = useResolverName(resolver);

  const navigate = useNavigate();
  return (
    <Stack
      onClick={() => navigate({ to: '/marketplace' })}
      cursor="pointer"
      gap={4}
      minH="250px"
      borderRadius="8px"
      position="relative"
      _before={{
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url('${profileBanner}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        borderRadius: 'md',
      }}
    >
      <Flex align="center" gap={4} cursor="pointer">
        {!hasDomain && (
          <Button
            ml={4}
            as={Link}
            to="/"
            borderColor="grey.100"
            color="grey.100"
            variant="outline"
            width="fit-content"
            fontSize="xs"
            _hover={{
              opacity: 0.7,
            }}
            _focus={{
              bg: 'none',
            }}
          >
            Get your Handle
          </Button>
        )}
        <Icon as={PoweredByIcon} w="118px" h="65px" ml="auto" />
      </Flex>
      <Flex
        align="center"
        px={4}
        justify="space-between"
        alignItems="flex-end"
        mt="auto"
        mb={2}
        zIndex={10}
      >
        <ProfileSummary
          name={name}
          isDomain={!!hasDomain}
          nftQuantity={nftQuantity}
          usdValue={usdValue}
        />
      </Flex>
    </Stack>
  );
};

const ProfileSummary = ({
  name,
  isDomain,
  nftQuantity,
  usdValue,
}: {
  name: string;
  isDomain: boolean;
  nftQuantity: number;
  usdValue: number;
}) => {
  const { metadata, loadingMetadata } = useMetadata();
  const avatar = metadata?.find((m) => m.key === MetadataKeys.AVATAR);

  const formattedUsdValue = usdValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Flex
      w="full"
      align="center"
      justify="space-between"
      alignItems="flex-end"
      mb={2.5}
    >
      <Flex align="start" h="61px" gap={2}>
        {loadingMetadata ? (
          <Skeleton w="61px" h="61px" rounded="lg" />
        ) : avatar?.value ? (
          <Image
            src={avatar.value}
            referrerPolicy="no-referrer"
            fetchPriority="high"
            alt="Profile avatar"
            w="61px"
            h="61px"
            objectFit="cover"
            rounded="lg"
          />
        ) : (
          <Icon w="61px" h="61px" as={AvatarIcon} />
        )}

        <VStack align="flex-start" spacing={0}>
          <Flex flexDir="column" justifyContent="space-between" h="61px">
            <Flex gap={2} align="center" mt="auto">
              <Heading
                fontSize="2xl"
                fontWeight={600}
                color="#fff"
                lineHeight="1"
              >
                {name}
              </Heading>
              <Icon
                as={isDomain ? VerifiedBadgeIcon : UnverifiedBadgeIcon}
                w={4}
                h={4}
                mt="auto"
              />
            </Flex>
          </Flex>
        </VStack>
      </Flex>

      <Flex gap={4}>
        <StatBox label="NFT's" value={nftQuantity} />
        <StatBox label="USD value" value={formattedUsdValue} />
      </Flex>
    </Flex>
  );
};
