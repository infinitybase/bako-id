import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { CheckBadge } from './checkBadge';

interface IMetadataCard {
  key: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
  verified?: boolean | null;
}

export const MetadataCard = ({
  icon,
  onClick,
  title,
  key,
  verified,
}: IMetadataCard) => {
  return (
    <Box
      key={key}
      w={36}
      h={32}
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
      borderColor={verified ? 'button.500' : 'input.600'}
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
