import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { CheckBadge } from './checkBadge';
import type { MetadataKeys } from '../../utils/metadataKeys';

interface IMetadataCard {
  keys: MetadataKeys;
  title: string;
  icon: ReactNode;
  onClick: () => void;
  isEmpty: boolean;
  isUpdated: boolean;
}

export const MetadataCard = ({
  icon,
  onClick,
  title,
  keys,
  isEmpty,
  isUpdated,
}: IMetadataCard) => {
  return (
    <Box
      key={keys}
      w={['8.5rem', '8.8rem']}
      h="8rem"
      display="flex"
      flexDirection="row"
      onClick={onClick}
      backgroundColor={isEmpty && !isUpdated ? 'input.600' : 'input.900'}
      alignItems="center"
      justifyContent="center"
      rounded="xl"
      position="relative"
      cursor="pointer"
      _hover={{ transform: 'scale(1.05)', transition: 'all 0.2s' }}
      border="1.5px solid"
      borderColor={isUpdated ? 'button.500' : 'input.600'}
    >
      {(!isEmpty || isUpdated) && <CheckBadge isUpdated={isUpdated} />}

      <Flex
        flexDir="column"
        align="center"
        gap={2}
        justify="center"
        color={isEmpty && !isUpdated ? 'section.200' : 'grey.400'}
      >
        {icon}
        <Text key={title}>{title}</Text>
      </Flex>
    </Box>
  );
};
