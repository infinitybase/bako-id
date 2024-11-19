import { Center, HStack, Icon, Text, type BoxProps } from '@chakra-ui/react';

import { ENSIcon } from '../icons/ensicon';

interface ENSBannerProps extends BoxProps {}

export const ENSBanner = ({ onClick }: ENSBannerProps) => {
  return (
    <HStack
      w="full"
      h="56px"
      bgColor="input.600"
      borderRadius="lg"
      spacing={4}
      _hover={{ cursor: 'pointer' }}
      onClick={onClick}
      overflow={'hidden'}
    >
      <Center
        w="56px"
        h="full"
        bg={'linear-gradient(45deg, #7F9DFB 0%, #4BBAF2 100%)'}
      >
        <Icon as={ENSIcon} fontSize={36} />
      </Center>

      <Text flex={1} fontSize="xs" color="section.200" whiteSpace="pretty">
        Import your ENS account
      </Text>
    </HStack>
  );
};
