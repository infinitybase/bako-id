import {
  Button,
  Card,
  Center,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FarcasterIcon } from '../../components/icons/farcaster';
import { TwitterIcon } from '../../components/icons/twitter';
import { SearchInput } from '../../components/inputs';
import { useHome } from './hooks';

export const Home = () => {
  const { handleChangeDomain, domainIsAvailable, isConnected } = useHome();

  return (
    <Center w="full" h="full" alignItems="center" zIndex={10}>
      <Card
        h={['70%', '50%', 'auto']}
        maxW={['95%', '70%', 'auto']}
        variant="glassmorphic"
        border="1px solid rgba(243, 242, 241, 0.05)"
        padding={[6, 8, 12]}
        mt={[12, 12, 0]}
        mb={['auto', 'auto', 20]}
      >
        <Stack
          w="full"
          direction="column"
          px={[0, 8]}
          textAlign="center"
          spacing={8}
        >
          <Text
            className="bg-pan-tl"
            bgClip="text"
            fontWeight={700}
            fontSize={{ base: 26, md: 42 }}
            gap={2}
          >
            Bring your Farcaster username to Handles
          </Text>

          <Stack
            direction={['column', 'row']}
            w="full"
            gap={[4, 0]}
            justify="space-around"
          >
            <Button
              w={['full', isConnected ? '90%' : '45%']}
              p={6}
              bgColor="button.500"
              rounded="lg"
            >
              <Icon as={FarcasterIcon} />
              <Text ml={2}>Farcaster</Text>
            </Button>
            {!isConnected && (
              <Button
                w={['full', '45%']}
                p={6}
                bgColor="button.500"
                rounded="lg"
              >
                <Icon as={TwitterIcon} />
                <Text ml={2}>Twitter</Text>
              </Button>
            )}
          </Stack>

          <HStack
            h={8}
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
          </HStack>

          <VStack w="full" h="100%" display="flex" flexDir="column" spacing={8}>
            <Text
              className="bg-pan-tl"
              bgClip="text"
              fontWeight={700}
              fontSize={{ base: 26, md: 42 }}
            >
              Search new Handles
            </Text>

            <VStack w="full" h="full" spacing={5}>
              <SearchInput
                onChange={handleChangeDomain}
                errorMessage={undefined}
                available={domainIsAvailable}
              />

              <Text
                fontSize="sm"
                color="grey.100"
                cursor="pointer"
                _hover={{ color: 'button.500' }}
                onClick={() =>
                  window.open('https://twitter.com/bakoidentity', '_blank')
                }
              >
                Learn more
              </Text>
            </VStack>
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
