import { ReactElement } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface InfoButtonProps extends ButtonProps {
    children: ReactElement | ReactElement[]
}

export const InfoButton = ({ children, ...button }: InfoButtonProps) => {
  return (
    <Button
      display="flex"
      gap={3}
      p={2}
      background="rgba(197, 197, 197, 50%)"
      border={1}
      borderStyle="solid"
      rounded={8}
      borderColor="rgba(134, 127, 125, 50%)"
      _hover={{}}
      _active={{}}
      color="background.600"
      {...button}
    >
      {children}
    </Button>
  )
}
