import { Badge, Spinner, type BadgeProps } from '@chakra-ui/react';

interface IBadge extends BadgeProps {}

export const UnavailableBadge = (props: IBadge) => (
  <Badge variant="notsupported" border="none" {...props}>
    Registered
  </Badge>
);

export const NotSupportedBadge = (props: IBadge) => (
  <Badge variant="error" {...props}>
    Not supported
  </Badge>
);

export const AvailableBadge = (props: IBadge) => (
  <Badge variant="success" {...props}>
    Available
  </Badge>
);

export const SearchingBadge = (props: IBadge) => (
  <Badge variant="grey" border="none" {...props}>
    Searching..
    <Spinner w={3} h={3} />
  </Badge>
);
