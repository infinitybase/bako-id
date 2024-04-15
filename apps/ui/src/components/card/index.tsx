import { CardProps, Card as ChakraCard } from '@chakra-ui/react';

export interface ICardProps extends CardProps {}

const Card = (props: ICardProps) => {
  const { children, ...rest } = props;

  return (
    <ChakraCard
      variant="glassmorphic"
      border="1px solid"
      borderColor="stroke.500"
      display="flex"
      borderRadius="xl"
      p={6}
      {...rest}
    >
      {children}
    </ChakraCard>
  );
};

export { Card };
