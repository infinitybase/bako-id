import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useRouter } from '@tanstack/react-router';

export const GoBack = () => {
  const { history } = useRouter()

  const handleGoBack = () => {
    history.go(-1)
  }

  return <Button variant="ghost" display="flex" alignSelf="start" gap={3} px={0} fontSize="xs" _hover={{ background: 'transparent' }}>
    <ChevronLeftIcon onClick={handleGoBack} />
    Back
  </Button>
}
