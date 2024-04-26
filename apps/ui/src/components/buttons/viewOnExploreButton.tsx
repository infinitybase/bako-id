import { Button, useMediaQuery, type ButtonProps } from '@chakra-ui/react';
import { ExploreIcon } from '../icons/explore';

export const ViewOnExplorerButton = (props: ButtonProps) => {
  const [isMobile] = useMediaQuery('(max-width: 23em)');

  return (
    <Button
      variant="ghost"
      size="xs"
      fontWeight="normal"
      rightIcon={<ExploreIcon w={4} h={4} />}
      color="white"
      _hover={{
        bgColor: 'transparent',
        color: 'button.500',
      }}
      {...props}
    >
      {isMobile ? 'Explorer' : 'View on Explorer'}
    </Button>
  );
};
