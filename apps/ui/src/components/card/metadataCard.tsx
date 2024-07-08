import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { CheckBadge } from './checkBadge';

interface IMetadataCard {
  keys: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
  verified?: boolean | null;
}

export const MetadataCard = ({
  icon,
  onClick,
  title,
  keys,
  verified,
}: IMetadataCard) => {
  return (
    <Box
      key={keys}
      w={[32, 32, 36, 36]}
      h={[28, 28, 32, 32]}
      display="flex"
      flexDirection="row"
      onClick={onClick}
      backgroundColor={verified === null ? 'input.600' : 'input.900'}
      alignItems="center"
      justifyContent="center"
      rounded="xl"
      position="relative"
      cursor="pointer"
      _hover={{
        transform: 'scale(1.05)',
        transition: 'all 0.2s',
      }}
      border="1.5px solid"
      borderColor={verified !== null && !verified ? 'button.500' : 'input.600'}
    >
      {verified !== null && <CheckBadge verified={!!verified} />}

      <Flex
        flexDir="column"
        align="center"
        gap={2}
        justify="center"
        color={verified === null ? 'section.200' : 'grey.400'}
      >
        {icon}

        <Text key={title}>{title}</Text>
      </Flex>
    </Box>
  );
};
