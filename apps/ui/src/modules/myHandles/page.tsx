import { Box, useMediaQuery } from '@chakra-ui/react';
import { MyHandlesCard } from './components/myHandlesCard';
import { MyHandlesCardMobile } from './components/myHandlesCardMobile';
import { useMyHandles } from './hooks';

export const MyHandles = () => {
  const [isMobile] = useMediaQuery('(max-width: 30em)');
  const { data: handles, isLoading, isFetching } = useMyHandles();

  return (
    <Box w="full" h="full">
      {isMobile ? (
        <MyHandlesCardMobile
          handles={handles}
          isLoading={isLoading || isFetching}
        />
      ) : (
        <MyHandlesCard handles={handles} isLoading={isLoading || isFetching} />
      )}
    </Box>
  );
};
