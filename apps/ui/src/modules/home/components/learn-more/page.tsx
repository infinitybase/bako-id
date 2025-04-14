import {
  Box,
  CardBody,
  Center,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Card, GoBack } from '../../../../components';
import { useScreenSize } from '../../../../hooks/useScreenSize';

export const LearnMore = () => {
  const { isMobile, isLessThan820 } = useScreenSize();
  return (
    <>
      {!isMobile && <GoBack />}
      <VStack h="90vh" pb={isLessThan820 ? 24 : 14}>
        <Box
          w="full"
          h="full"
          overflowY="scroll"
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px',
              maxHeight: '300px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
            },
          }}
          display="flex"
          alignItems="center"
          mt={[6, 6, 6, 0]}
          flexDirection="column"
        >
          <Center
            w={['80%', '38rem']}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap={8}
          >
            <Flex direction="column" gap={3}>
              <Heading fontSize="lg">What are Bako ID Handles?</Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  Bako ID Handles are the native naming system across the Fuel
                  ecosystem rollups and beyond. They establish identities for
                  people, rather than for chains. These human-readable names can
                  be used when connecting to onchain apps and for sending and
                  receiving on Fuel and other compatible chains.
                </CardBody>
              </Card>
            </Flex>
            <Flex direction="column" gap={3}>
              <Heading fontSize="lg">
                What are the Handle registration fees?
              </Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  Handles are priced based on name length and are designed to be
                  globally accessible. Annual registration fees are as follows:
                </CardBody>
              </Card>
            </Flex>
            <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">Length Price</Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  <Text>3 characters 0.1 ETH</Text>
                  <Text>4 characters 0.01 ETH</Text>
                  <Text>5+ characters 0.001 ETH</Text>
                </CardBody>
              </Card>
            </Flex>
            {/* <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">
                How do I get a free or discounted Handle?
              </Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  You can receive one free Handle (5+ letters) for 3 years if
                  you meet any of the following criteria:
                  <UnorderedList>
                    <ListItem>
                      Create a Bako Safe account using a Passkey, and
                    </ListItem>
                    <ListItem>Complete any transaction above $20 USD.</ListItem>
                  </UnorderedList>
                </CardBody>
              </Card>
            </Flex> */}
            <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">How can I use my Handle?</Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  You can use your Handle across apps in the Fuel ecosystem,
                  including Bako ID, Bako Safe, and other compatible services.
                  With supported services, you can send and receive assets
                  simply by entering your Handle instead of your wallet address.
                </CardBody>
              </Card>
            </Flex>
            <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">
                Is my profile information published onchain?
              </Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  Handles will soon be fully onchain. Any information you
                  publish will be recorded onchain, require a transaction, and
                  be broadly composable with the rest of the ecosystem. Please
                  avoid publishing any sensitive information you do not want to
                  be onchain.
                </CardBody>
              </Card>
            </Flex>
            <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">
                I am a builder. How do I integrate Handles into my app?
              </Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  If you are a builder looking to integrate Handles into your
                  app, the{' '}
                  <Link
                    href="https://docs.bako.id/"
                    target="_blank"
                    textDecor="underline"
                    color="#72b3fd"
                  >
                    Bako ID SDK
                  </Link>{' '}
                  is the easiest way to get started. If you have ideas for new
                  features or badges to integrate with Handles, we would love to
                  hear from you
                </CardBody>
              </Card>
            </Flex>
            <Flex direction="column" gap={3} w="full">
              <Heading fontSize="lg">
                How do I get a Handle for my app or project?
              </Heading>
              <Card w="full">
                <CardBody fontSize="xs" fontWeight="normal">
                  You can register a Handle for your app like any other Handle.
                  If a specific Handle for your app or project is unavailable,
                  it may have already been reserved. Some well-known names in
                  the ecosystem have been reserved by our team to ensure proper
                  identification. Please reach out to our team on{' '}
                  <Link
                    href="https://discord.com/invite/qyjhaCSbT5"
                    target="_blank"
                    textDecor="underline"
                    color="#72b3fd"
                  >
                    Discord
                  </Link>{' '}
                  or{' '}
                  <Link
                    href="https://x.com/bakosafe"
                    target="_blank"
                    textDecor="underline"
                    color="#72b3fd"
                  >
                    X
                  </Link>{' '}
                  for further assistance.
                </CardBody>
              </Card>
            </Flex>
          </Center>
        </Box>
      </VStack>
    </>
  );
};
