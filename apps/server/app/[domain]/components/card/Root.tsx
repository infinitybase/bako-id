import { Card } from '@/components/card';
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
      minH="240px"
      {...props}
    >
      {children}
    </Card>
  );
};
