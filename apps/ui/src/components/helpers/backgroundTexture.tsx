import { Box } from '@chakra-ui/react';

export const BackgroundTexture = () => {
  return (
    <Box
      className="texture"
      bottom={0}
      left={0}
      maxH={1000}
      minW={400}
      w={{ base: '100%', md: '70%' }}
    >
      {' '}
      <span className="main-gradient"></span>{' '}
    </Box>
  );
};
