import { Box, Button, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { HomeIcon } from '../icons/homeIcon';

export const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate({ to: '/' });
  };

  return (
    <Button
      onClick={handleGoBack}
      variant="ghost"
      alignSelf="start"
      _hover={{ color: 'button.500' }}
      color="white"
      ml={12}
    >
      <Box
        display="flex"
        alignItems="end"
        fontSize="xs"
        gap={1}
        justifyContent="center"
      >
        <HomeIcon w={4} h={4} />
        <Text>Home</Text>
      </Box>
    </Button>
  );
};
