import { Flex, Skeleton } from '@chakra-ui/react';

export const TokenCardSkeleton = () => {
  return (
    <Flex
      direction={['column', 'row', 'row', 'row']}
      alignItems="center"
      h="fit-content"
      justifyContent="flex-end"
      gap={4}
      w="full"
    >
      <Flex w={['full', '80%']} direction="column" gap={6}>
        <Skeleton w="full" h={16} rounded="lg" />
        <Skeleton w="full" h={16} rounded="lg" />
      </Flex>

      <Skeleton
        w={['fit-content', '40', '40', '40']}
        h={['fit-content', '40', '40', '40']}
      />
    </Flex>
  );
};
