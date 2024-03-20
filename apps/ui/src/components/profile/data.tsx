import { VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
interface ProfileDataProps {
  children: ReactElement | ReactElement[],
  // actions: ReactElement | ReactElement[]
}

export const Data = ({ children }: ProfileDataProps) => {
  return (
    <VStack
      p={6}
      position="relative"
      rounded={8}
      w="full"
      gap={6}
      overflow="hidden"
      bg="white"
      alignItems="start"
    >
      {children}
    </VStack>
  )
}
