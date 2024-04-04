import { Badge, type BadgeProps } from '@chakra-ui/react';

interface IBadge extends BadgeProps {}

export const UnavailableBadge = (props: IBadge) => (
  <Badge variant="error" {...props}>
    Unavailable
  </Badge>
);

export const AvailableBadge = (props: IBadge) => (
  <Badge variant="success" {...props}>
    Available
  </Badge>
);
