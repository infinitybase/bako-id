import { CheckIcon } from '@chakra-ui/icons';
import { Box, Icon } from '@chakra-ui/react';
import { CardBadge } from '../icons/cardBadge';

type CheckBadgeProps = {
  isUpdated: boolean;
};

export const CheckBadge = ({ isUpdated }: CheckBadgeProps) => {
  return (
    <>
      <Box
        position="absolute"
        top="-0.5px"
        right="-0.5px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CardBadge w={8} h={8} color={isUpdated ? 'button.500' : '#5E5955'} />
      </Box>

      <Icon
        as={CheckIcon}
        boxSize={3}
        position="absolute"
        top="4px"
        right="4px"
        color="input.600"
      />
    </>
  );
};
