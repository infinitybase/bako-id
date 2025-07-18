import { Button, Flex, Heading, Image, Text } from '@chakra-ui/react';

import EmptyBanner from '@/assets/marketplace/empty-state.png';

export const MartketplaceEmptyState = () => {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Image
        src={EmptyBanner}
        objectPosition="top"
        maxW="503px"
        maxH="195px"
        borderRadius="md"
        objectFit="cover"
      />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={8}
      >
        <Heading fontSize="md" fontWeight={400} color="text.700" mb={3}>
          No items found
        </Heading>
        <Text fontSize="xs" fontWeight={400} color="grey.200" mb={8}>
          Connect a wallet with NFT's or explore new collections on the
          marketplace
        </Text>

        <Button
          variant="mktPrimary"
          className="transition-all-05"
          w={{ base: 'fit-content', md: '200px' }}
          letterSpacing="0.5px"
        >
          Explore collections
        </Button>
      </Flex>
    </Flex>
  );
};
