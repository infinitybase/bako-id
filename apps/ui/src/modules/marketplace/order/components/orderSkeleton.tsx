import { NftModal } from '@/modules/profile/components/nft/modal';
import { SimpleGrid, Skeleton, Stack } from '@chakra-ui/react';

export const OrderSkeleton = () => {
  return (
    <>
      <NftModal.Image w="full" src="" alt="Loading..." />
      <Stack spacing={4} direction="column" w="full">
        <Skeleton height="30px" w="100px" />
        <Skeleton height="10px" w="160px" />
        <Skeleton height="150px" w="full" />

        <Stack direction="row" spacing={4} w="full" alignItems="center">
          <Skeleton height="30px" w="30px" rounded="full" />
          <Skeleton height="20px" w="210px" />
          <Skeleton height="20px" w="20px" ml="auto" />
        </Stack>
        <Skeleton height="40px" w="full" />
        <SimpleGrid templateColumns="repeat(2, 1fr)" gap={4} w="full">
          <Skeleton height="60px" w="full" rounded="md" />
          <Skeleton height="60px" w="full" rounded="md" />
          <Skeleton height="60px" w="full" rounded="md" />
          <Skeleton height="60px" w="full" rounded="md" />
        </SimpleGrid>
      </Stack>
    </>
  );
};
