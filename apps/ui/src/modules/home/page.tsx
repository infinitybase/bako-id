import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import link from '../../assets/arrow-share.svg';
import { SearchInput } from '../../components/inputs';
import { useHome } from './hooks/useHome';

export const Home = () => {
  const {
    handleChangeDomain,
    handleConfirmDomain,
    domain,
    domainIsAvailable,
    resolveDomain,
  } = useHome();

  return (
    <Center w="full" h="full" alignItems="center" zIndex={10}>
      <VStack textAlign="center" spacing={6} padding={{ base: 4, md: 0 }}>
        <Text
          className="bg-pan-tl"
          bgClip="text"
          fontWeight={700}
          fontSize={{ base: 35, md: 48 }}
          gap={2}
        >
          Bring your Farcaster username to Handles
        </Text>

        <Divider
          w="60%"
          h="1px"
          border="none"
          bgGradient="linear(to-r, #FFC010, #B24F18)"
        />

        <Box
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

          {/* Buttons */}
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
        </Box>
      </VStack>
    </Center>
  );
};
