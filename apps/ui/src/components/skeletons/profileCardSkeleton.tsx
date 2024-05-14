import {
  Flex,
  Skeleton,
  SkeletonCircle,
  useMediaQuery,
} from '@chakra-ui/react';
import { AvatarIcon, Card } from '..';

export const ProfileCardSkeleton = () => {
  const [isLowerThanMobile] = useMediaQuery('(max-width: 25em)');

  return (
    <Card
      w="full"
      h="fit-content"
      flexDirection="row"
      alignItems="center"
      backdropFilter="blur(7px)"
      justifyContent="space-between"
    >
      <Skeleton w={24} h={24} rounded="lg" mr={3} as={AvatarIcon} />
      <Flex
        gap={4}
        alignItems={isLowerThanMobile ? 'flex-start' : 'flex-start'}
        w="full"
        flexDir={isLowerThanMobile ? 'column' : 'row'}
        justifyContent="space-between"
      >
        <Flex gap={2} direction="column">
          <Skeleton w="36" h={6} />

          <Flex gap={3}>
            <SkeletonCircle size="6" />
            <SkeletonCircle size="6" />
          </Flex>
        </Flex>
        <Skeleton rounded="md" w={32} h={10} />
      </Flex>
    </Card>
  );
};
