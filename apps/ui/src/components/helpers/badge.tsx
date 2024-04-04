import { Badge as ChakraBadge } from '@chakra-ui/react';

interface BadgeProps {
  title: string;
  color: string;
}

function Badge({ title, color }: BadgeProps) {
  return (
    <ChakraBadge
      color={color}
      fontSize="10px"
      marginRight="5rem"
      borderRadius="12px"
      border={`1px solid ${color}`}
      backgroundColor="inherit"
    >
      {title}
    </ChakraBadge>
  );
}

export const UnavailableBadge = () => (
  <Badge title="Unavailable" color="#F05D48" />
);

export const AvailableBadge = () => <Badge title="Available" color="#32C8D9" />;
