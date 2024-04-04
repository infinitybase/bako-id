import { CheckoutCard, GoBack } from '../components/helpers';
import { Box, Button, Center, HStack, Image, Text } from '@chakra-ui/react';
import { TwitterShareButton } from 'react-share';
import x from '../assets/x-logo.svg';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { resolver } from '@bako-id/sdk';
import { useMutation } from '@tanstack/react-query';

export const Purchased = () => {
  const { domain } = useParams({ strict: false });
  console.debug(domain);
  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver,
  });

  const navigate = useNavigate();

  // @TODO: change this to receive domain info by query params
  useEffect(() => {
    resolveDomainMutation
      .mutateAsync({
        domain,
        providerURL: 'https://beta-5.fuel.network/graphql',
      })
      .then((data) => {
        if (data === null) {
          navigate({
            to: '/',
            params: { domain: domain },
            startTransition: true,
          }).then();
        }
      });
  }, []);

  return (
    <Center
      w="full"
      h="full"
      display="flex"
      flexDir="column"
      py={2}
      px={{ base: 4, md: 20, xl: 40 }}
      zIndex={10}
    >
      <GoBack />
      <Box
        w="fit-content"
        h="full"
        pt="6rem"
        display="flex"
        flexDir="column"
        alignItems="center"
        gap={3}
      >
        <Box
          display="flex"
          flexDir="column"
          gap={6}
          justifyContent="center"
          alignItems="center"
          mb={8}
        >
          <Text
            className="bg-pan-tl"
            bgClip="text"
            fontWeight={700}
            fontSize={{ base: 35, md: 50 }}
            lineHeight={1}
            gap={2}
          >
            Congratulations
          </Text>
          <Text fontSize="sm"> You have secured your web3 domain name! </Text>
        </Box>

        <CheckoutCard domain={domain} />

        <HStack marginTop="2rem" gap={4} pb={10}>
          <Button
            style={{
              backgroundColor: 'inherit',
              color: 'white',
              fontSize: '16px',
              border: '1px solid white',
              width: '153px',
              opacity: '0.3',
            }}
            disabled={true}
            // onClick={() => setFormStep(LIST_DOMAINS)}
          >
            See My names
          </Button>

          <TwitterShareButton
            url="http://localhost:5173/"
            title="Create your web3 domain!"
            hashtags={['web3', 'fueldomains']}
            related={[]}
          >
            <Button
              backgroundColor="yellow-light"
              color="black"
              display="flex"
              alignItems="center"
              width="153px"
              gap={2}
              _hover={{ bgColor: 'button.600' }}
            >
              <Image src={x} />
              Share
            </Button>
          </TwitterShareButton>
        </HStack>
      </Box>
    </Center>
  );
};
