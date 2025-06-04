import EmptyAssets from '@/assets/assets-empty.png';
import { Button, Image, Stack, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

export default function ProfileWithoutAssets() {
  return (
    <Stack gap={6} alignItems="center" justifyContent="center" pb={10}>
      <Image src={EmptyAssets} height="195px" width="503px" objectFit="cover" />
      <Stack alignItems="center">
        <Text>No items found</Text>
        <Text color="grey.200" fontSize="xs">
          Discover new collection on Marketplace
        </Text>
      </Stack>

      <Button
        as={Link}
        to="/marketplace"
        variant="primary"
        alignSelf="center"
        w="fit-content"
        px={4}
      >
        Go to Marketplace
      </Button>
    </Stack>
  );
}
