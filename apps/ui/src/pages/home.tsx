import {
  Button,
  Center, Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  Text, Divider, HStack,
  Image
} from '@chakra-ui/react';
import { ChangeEvent, useMemo, useState } from 'react';
import { resolver } from '@fuel-domains/sdk';
import { useMutation } from '@tanstack/react-query';
import { useFuelConnect } from '../hooks';
import { useNavigate } from '@tanstack/react-router';

const checkDomain = (domain: string) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(domain);
};

export const Home = () => {
  const { wallet } = useFuelConnect();

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

  const handleConfirmDomain = async () => {
    const isValid = checkDomain(domain);
    if (!isValid) return;

    const info = await resolveDomainMutation.mutateAsync({
      domain,
      providerURL: wallet!.provider.url
    })

    console.debug(info?.name)

    if(!info) {
      navigate({ to: '/buy/$domain', params: { domain: domain }, startTransition: true }).then()
      return
    }

    navigate({ to: '/$domain', params: { domain: info.name }, startTransition: true }).then()
    return info;
  };

  return <Center w="full" h="full" alignItems="start" zIndex={10}>
    {/* opt-out for a margin top, and items start, aiming better center in screen, counting the header size */}
    <VStack mt={{ base: '5rem', md: "13rem" }} textAlign="center" spacing={6} padding={{ base: 4, md: 0 }}>
      <Text
        bgGradient="linear(to-br, #FFC010, #B24F18)"
        bgClip="text"
        fontWeight={700}
        fontSize={{ base: 35, md: 48 }}
        lineHeight={1}
        gap={2}
      >
        Ignite Your Identity <br /> with a {" "}
        <Text as="span" color="white">
          @
        </Text>{" "}
        Domain
      </Text>

      <Text fontSize={{ base: 12, md: 15 }} color={"text.700"}>
        Secure & scalable human readable addresses. <br />
        Natively designed with the modular ecosystem in mind.
      </Text>

      <Divider w="60%" h="1px" border="none" bgGradient="linear(to-r, #FFC010, #B24F18)" />

      <VStack spacing={5} w="full">
        <FormControl>
          <InputGroup borderRightColor="transparent">
            <Input
              value={domain}
              minW="12rem"
              w="full"
              maxW="24rem"
              borderRight="none"
              borderColor="whiteAlpha.50"
              textColor="text.700"
              background="background.400"
              onChange={handleChangeDomain}
              _focus={{}}
              _hover={{}}
              _focusVisible={{}}
            />
            <InputRightAddon borderLeftColor="transparent" bgColor="background.400">
              @
            </InputRightAddon>
          </InputGroup>
        </FormControl>

        {/* Buttons */}
        <VStack w="full" display="flex" flexDir="column" gap={2}>
          <Button
            w="full"
            isLoading={resolveDomainMutation.isPending}
            isDisabled={!isValidDomain}
            onClick={handleConfirmDomain}
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
            <Image w={4} src="/arrow-share.svg" />
          </HStack>
        </VStack>
      </VStack>
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
