import { Box, Skeleton, Stack } from '@chakra-ui/react';

export const MarketplaceBannerSkeleton = () => {
  return (
    <Stack gap={4}>
      <Box
        position="relative"
        height="250px"
        borderRadius="8px"
        overflow="hidden"
      >
        <Skeleton height="100%" borderRadius="8px" />
      </Box>

      {/* Pagination dots skeleton */}
      <Box display="flex" justifyContent="center" gap={2}>
        {['dot-1', 'dot-2', 'dot-3'].map((dotId) => (
          <Skeleton key={dotId} width="8px" height="8px" borderRadius="50%" />
        ))}
      </Box>
    </Stack>
  );
};
