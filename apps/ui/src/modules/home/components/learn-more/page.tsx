import { Box, CardBody, Center, Flex, Heading } from '@chakra-ui/react';
import { Card, GoBack } from '../../../../components';
import { useScreenSize } from '../../../../hooks/useScreenSize';

export const LearnMore = () => {
  const { isMobile } = useScreenSize();
  return (
    <>
      {!isMobile && <GoBack />}
      <Box
        w="full"
        h="full"
        maxH={['80%', 'full', '75%', 'full']}
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
          h={['90%', 'xl']}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={8}
        >
          <Flex direction="column" gap={3}>
            <Heading fontSize="lg">Why .FUEL?</Heading>
            <Card w="full">
              <CardBody fontSize="xs" fontWeight="normal">
                The Fuel Network introduces an Execution Layer designed to
                enhance the efficiency, scalability, and security of modular
                blockchain operations. Within this future proof landscape, .fuel
                Handles emerges as the element for dApps and users to establish
                a Secure, Scalable and Recognizable online identity.
              </CardBody>
            </Card>
          </Flex>
          <Flex direction="column" gap={3}>
            <Heading fontSize="lg">How It Works?</Heading>
            <Card w="full">
              <CardBody fontSize="xs" fontWeight="normal">
                Purchasing a .fuel Handles involves a unique process where you
                initially secure your Handles name as a Non-Fungible Token (NFT)
                on the Ethereum blockchain. This method allows for immediate
                ownership and control over your Handles in the form of an NFT,
                providing a secure and verifiable asset even before the Fuel
                Network mainnet is live.
                <br />
                Once the mainnet launches, you will have the exclusive right to
                claim your corresponding .fuel address using the NFT you've
                purchased. This seamless transition from an NFT on Ethereum to a
                functional Handles on the Fuel Network ensures that early
                adopters can secure their preferred names ahead of widespread
                adoption.
              </CardBody>
            </Card>
          </Flex>
          <Flex direction="column" gap={3}>
            <Heading fontSize="lg">The Fuel Ecosystem</Heading>
            <Card w="full">
              <CardBody fontSize="xs" fontWeight="normal">
                Fuel v1 began as a layer-2 (L2) scalability technology for a
                monolithic Ethereum. It was the first optimistic rollup on
                mainnet Ethereum, deployed at the end of 2020.
                <br /> <br />
                Today, Fuel is the fastest modular execution layer. Fuel
                delivers the highest security and flexible throughput, focusing
                on a superior developer experience.
              </CardBody>
            </Card>
          </Flex>
        </Center>
      </Box>
    </>
  );
};
