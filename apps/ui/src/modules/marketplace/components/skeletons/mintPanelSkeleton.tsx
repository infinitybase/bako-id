import { Flex, Skeleton } from '@chakra-ui/react';

const MintPanelSkeleton = () => {
  return (
    <Flex
      flexDir="column"
      color="white"
      borderRadius="lg"
      gap={6}
      mt={6}
      w="full"
      maxW="container.xl"
    >
      <Flex gap={6}>
        <Skeleton boxSize="500px" borderRadius="lg" />
        <Flex direction="column" gap={4}>
          <Skeleton boxSize="113px" borderRadius="lg" />
          <Skeleton boxSize="113px" borderRadius="lg" />
          <Skeleton boxSize="113px" borderRadius="lg" />
          <Skeleton boxSize="113px" borderRadius="lg" />
        </Flex>

        <Skeleton flex={1} />
      </Flex>

      <Skeleton w="full" py="73px" h="414px" />
    </Flex>
  );
};

export default MintPanelSkeleton;
