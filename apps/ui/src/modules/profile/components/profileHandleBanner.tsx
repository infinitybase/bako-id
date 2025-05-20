import Banner from '@/assets/profile-handle-banner.png';
import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

const ProfileHandleBanner = () => {
  return (
    <Box height="230px" position="relative">
      <Box position="absolute" top="50%" left={10} transform="translateY(-50%)">
        <Stack spacing={4}>
          <Box>
            <Heading>
              Own. Tag.{' '}
              <Text as="span" color="#F5F5F54D">
                Use.
              </Text>
            </Heading>
            <Text color="grey.100">
              Turn your Fuel address into a Handle and get
              <br />
              <Text as="span" color="yellow.500">
                lower trade fees.
              </Text>{' '}
              Your identity starts here.
            </Text>
          </Box>

          <Button
            as={Link}
            to="/"
            borderColor="grey.100"
            color="grey.100"
            variant="outline"
            width="fit-content"
            _hover={{
              opacity: 0.7,
            }}
          >
            Get your Handle
          </Button>
        </Stack>
      </Box>
      <Image src={Banner} boxSize="full" objectFit="cover" borderRadius="8px" />
    </Box>
  );
};

export default ProfileHandleBanner;
