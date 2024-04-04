import type { ReactElement } from 'react';
import { Button, type ButtonProps } from '@chakra-ui/react';

interface InfoButtonProps extends ButtonProps {
  children: ReactElement | ReactElement[];
}

export const InfoButton = ({ children, ...button }: InfoButtonProps) => {
  return (
    <Button
      display="flex"
      gap={3}
      p={2}
      background="#C5C5C5"
      border={1}
      rounded={8}
      borderColor="#867F7D"
      {...button}
    >
      {children}
    </Button>
  );
};
