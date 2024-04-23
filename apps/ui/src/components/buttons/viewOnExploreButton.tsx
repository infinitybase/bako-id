import { Button, type ButtonProps } from '@chakra-ui/react';
import { ExploreIcon } from '../icons/explore';

export const ViewOnExploreButton = (props: ButtonProps) => {
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
      View on Explore
    </Button>
  );
};
