import { Box, Card, Center, Stack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { Autocomplete } from '../../components/inputs/autocomplete';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Center
      w="full"
      h="full"
      alignItems="center"
      justifyContent="center"
      zIndex={10}
    >
      <Card
        h={['auto', 'auto', 'auto', 'auto']}
        maxW={['md', 'lg', '33rem', '33rem']}
        border="1px solid rgba(243, 242, 241, 0.05)"
        p={[6, 8, 16, 16]}
        mt={[12, 12, 6, 0]}
        mx={[2, 0]}
        mb={['auto', 'auto', 'auto', 32]}
      >
        <Stack
          w="full"
          direction="column"
          alignItems="center"
          px={[0, 4]}
          textAlign="center"
          spacing={12}
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Text
              className="bg-pan-tl"
              bgClip="text"
              fontWeight={700}
              fontSize={{ base: 24, md: 32, lg: 32, xl: 32 }}
              gap={2}
            >
              Search new Handle
            </Text>

            <Text fontSize="sm" color="section.200">
              The native naming system across the Fuel ecosystem Rollups and
              beyond. Powered by BakoID
            </Text>
          </Box>

          {/* <Stack
            direction={['column', 'row']}
            w="full"
            gap={[4, 0]}
            justify="space-around"
          >
            <Button p={6} variant="primary">
              <Icon as={FarcasterIcon} w={4} h={4} />
              <Text ml={2}>Farcaster</Text>
            </Button>
          </Stack>

          <HStack
            h={2}
            display="flex"
            alignItems="center"
            justify="space-around"
            w="full"
          >
            <Divider w="40%" border="1px solid" borderColor="grey.400" />
            <Text fontSize="sm" color="grey.200">
              OR
            </Text>
            <Divider w="40%" border="1px solid" borderColor="grey.400" />
          </HStack> */}

          <VStack w="full" h="full" spacing={10}>
            <Autocomplete key="home" />

            <Text
              fontSize="sm"
              color="grey.100"
              cursor="pointer"
              _hover={{ color: 'button.500' }}
              onClick={() => navigate({ to: '/learn-more' })}
            >
              Learn more
            </Text>
          </VStack>

          {/* <Box
            as="form"
            w="full"
            display="flex"
            flexDir="column"
            gap={4}
            onSubmit={handleConfirmDomain}
          >
            <SearchInput
              onChange={handleChangeDomain}
              errorMessage={undefined}
              available={domainIsAvailable}
            />

            <VStack w="full" display="flex" flexDir="column" gap={2}>
              <Button
                w="full"
                type="submit"
                isLoading={resolveDomain.isPending}
                isDisabled={domain.length < 3 || resolveDomain.isPending}
                background="button.500"
                color="background.500"
                fontSize={14}
                _hover={{ bgColor: 'button.600' }}
              >
                {domainIsAvailable ? 'Buy Domain' : 'Check domain'}
              </Button>
              <HStack
                cursor="pointer"
                onClick={() =>
                  window.open('https://twitter.com/bakoidentity', '_blank')
                }
                alignSelf="flex-end"
              >
                <Text fontSize={11} color="yellow-medium" fontWeight={'bold'}>
                  Learn more
                </Text>
                <Image w={4} src={link} />
              </HStack>
            </VStack>
          </Box> */}
        </Stack>
      </Card>
    </Center>
  );
};
