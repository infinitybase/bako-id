import { Flex, Skeleton } from '@chakra-ui/react';
import { Card } from '../card';

export const OwnershipCardSkeleton = () => {
  return (
    <Card
      w="full"
      h={['fit-content', 'fit-content', 'fit-content', 'full']}
      p={6}
      display="flex"
      backdropFilter="blur(7px)"
      flexDirection="column"
      gap={5}
    >
      <Flex alignItems="center" justify="space-between">
        <Skeleton height="8" width="32" rounded="md" />
      </Flex>
      <Flex
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={3}
      >
        <Skeleton w="full" h={9} rounded="lg" />
        <Skeleton w="full" h={9} rounded="lg" />
      </Flex>
    </Card>
  );
};
