import { Card } from '@/components';
import type { CardProps } from '@chakra-ui/react';

interface RootProps extends CardProps {
  children: React.ReactNode;
}

export const Root = ({ children, ...props }: RootProps) => {
  return (
    <Card
      p={0}
      borderRadius="8px"
      backdropFilter="none"
      maxW="400px"
      minW={{
        lg: '150px',
      }}
      mx={{
        base: 'auto',
      }}
      {...props}
    >
      {children}
    </Card>
  );
};
