import {
  Button,
  Center,
  Flex,
  VStack,
  Text, Divider, HStack,
  Image, Box
} from '@chakra-ui/react';
import { ChangeEvent, useMemo, useState } from 'react';
import { resolver } from '@fuel-domains/sdk';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { SearchInput } from '../components/inputs';
import link from '../assets/arrow-share.svg'

const checkDomain = (domain: string) => {
  if(domain.length < 3) return false
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(domain);
};

export const Home = () => {
  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });

  const navigate = useNavigate()
  const [domain, setDomain] = useState('');
  const isValidDomain = useMemo(() => {
    return checkDomain(domain);
  }, [domain]);

  const handleChangeDomain = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target ?? {};
    const isValid = checkDomain(value);

    if (isValid || !value) {
      setDomain(value);
    }
  };

  const handleConfirmDomain = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    console.debug(e)
    const isValid = checkDomain(domain);
    if (!isValid) return;

    const info = await resolveDomainMutation.mutateAsync({
      domain,
      providerURL: "https://beta-5.fuel.network/graphql"
    })

    if(!info) {
      navigate({ to: '/buy/$domain', params: { domain: domain }, startTransition: true }).then()
      return
    }

    navigate({ to: '/$domain', params: { domain: info.name }, startTransition: true }).then()
  };

  return <Center w="full" h="full" alignItems="start" zIndex={10}>
    {/* opt-out for a margin top, and items start, aiming better center in screen, counting the header size */}
    <VStack mt={{ base: '5rem', md: "13rem" }} textAlign="center" spacing={6} padding={{ base: 4, md: 0 }}>
      <Text
        className="bg-pan-tl"
        bgClip="text"
        fontWeight={700}
        fontSize={{ base: 35, md: 48 }}
        lineHeight={1}
        gap={2}
      >
        Your web3 username
      </Text>

      <Text fontSize={{ base: 12, md: 15 }} color={'text.700'}>
        Your identity across web3, one name for all your crypto addresses,<br />
        and your decentralised website.
      </Text>

      <Divider w="60%" h="1px" border="none" bgGradient="linear(to-r, #FFC010, #B24F18)" />
        <Box as="form" w="full" display="flex" flexDir="column" gap={4} onSubmit={handleConfirmDomain}>
          <SearchInput onChange={handleChangeDomain} errorMessage={undefined} />

          {/* Buttons */}
          <VStack w="full" display="flex" flexDir="column" gap={2}>
            <Button
              w="full"
              type="submit"
              isLoading={resolveDomainMutation.isPending}
              isDisabled={!isValidDomain}
              background="button.500"
              color="background.500"
              fontSize={14}
              _hover={{ bgColor: 'button.600' }}
            >
              Check domain
            </Button>
            <HStack
              cursor="pointer"
              onClick={() => window.open("https://twitter.com/bakoidentity", "_blank")}
              alignSelf="flex-end"
            >
              <Text fontSize={11} color="yellow-medium" fontWeight={"bold"}>
                Learn more
              </Text>
              <Image w={4} src={link} />
            </HStack>
          </VStack>
        </Box>
      <Flex w="full" justifyContent="center">
        <Text
          position={"absolute"}
          bottom={10}
          w="70%"
          maxW={500}
          color={"text.500"}
          fontSize={10}
          textAlign={"center"}
        >
          Your .fuel domain will be registered as an NFT on Ethereum. Upon the launch of the Fuel Network mainnet, you'll be able to claim your corresponding .fuel address using your NFT.
        </Text>
      </Flex>
    </VStack>
  </Center>
}
