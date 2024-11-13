import { Box, useMediaQuery } from '@chakra-ui/react';
import { MyHandlesCard } from './components/myHandlesCard';
import { MyHandlesCardMobile } from './components/myHandlesCardMobile';
import { useMyHandles } from './hooks';

export const MyHandles = () => {
  const [isMobile] = useMediaQuery('(max-width: 30em)');
  const { data: handles } = useMyHandles();

  return (
    <Box w="full" h="full">
      {isMobile ? (
        <MyHandlesCardMobile handles={handles} />
      ) : (
        <MyHandlesCard handles={handles} />
      )}
    </Box>
  );
};
