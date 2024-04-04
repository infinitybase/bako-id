import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from '@tanstack/react-router';

export const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate({ to: '/' });
  };

  return (
    <Button
      variant="ghost"
      display="flex"
      alignSelf="start"
      gap={3}
      px={0}
      fontSize="xs"
      _hover={{ background: 'transparent' }}
      color="white"
    >
      <ChevronLeftIcon onClick={handleGoBack} />
      Back
    </Button>
  );
};
