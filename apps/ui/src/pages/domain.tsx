import { useMutation } from '@tanstack/react-query';
import { Domain as IDomain, resolver } from '@fuel-domains/sdk';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Center,
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  Flex,
  Skeleton,
  useToast, Fade
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { GoBack } from '../components/helpers';



function shortString(str: string) {
  return str.slice(0, 5) + "..." + str.slice(-4);
}

const Domain = () => {
  const { domain } = useParams({ strict: false })
  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });
  const [data, setData] = useState<IDomain | null>(null)
  const toast = useToast()

  useEffect(() => {
    resolveDomainMutation.mutateAsync({
      domain,
      providerURL: "https://beta-5.fuel.network/graphql"
    }).then(data => setData(data))
  }, [])

  const copy = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!data?.owner) return

    toast({
      title: 'Copied',
      status: 'success',
      duration: 1000,
      isClosable: true,
    })

    if(e.currentTarget.id === "resolver") {
      navigator.clipboard.writeText(data.resolver);
      return
    }
    navigator.clipboard.writeText(data.owner);
  }

  return (
    <Center w="full" h="full" display="flex" flexDir="column" py={2} px={{ base: 4, md: 20, xl: 40 }} zIndex={10}>
      <GoBack />
      <Center w="full" h="full">
        <Card background="background.600" w='full' maxW="2xl" boxShadow='lg'>
          <CardBody>
            <Flex alignItems="center" gap={6}>
              <Box rounded={50} w="6rem" h="6rem" bgGradient="linear(to-br, #FFC010, #B24F18)"></Box>
              {!data?.name ?
                <Flex flexDir="column" gap={2}>
                  <Skeleton height="1rem" w="7rem" />
                  <Skeleton height="1rem" w="2rem" />
                </Flex>
                :
                <Fade in={!!data?.name}>
                  <Flex flexDir="column" gap={2}>
                    <Heading size='md' color="text.700">{data.name}</Heading>
                    <Text fontSize='xs' color="grey.200">Fuel</Text>
                  </Flex>
                </Fade>
              }
            </Flex>
            <Stack mt='6' spacing='3' justifyContent="start">
              <Box display="flex" flexDir="column" w="min-content" gap={2}>
                <Text fontSize='sm' color="grey.200">Addresses</Text>
                {!data?.resolver ?
                  <Skeleton height="2.5rem" w="7rem" rounded={8} /> :
                  <Fade in={!!data?.resolver}>
                    <Button
                      id="resolver"
                      className="transition-all-05"
                      variant="outiline"
                      rounded={8}
                      p={2}
                      borderColor="grey.300"
                      borderWidth={1}
                      background="semi-transparent"
                      display="flex"
                      color="text.700"
                      gap={3}
                      _hover={{ background: 'transparent', transform: 'translate(0px, -3px)' }}
                      onClick={copy}
                    >
                      {shortString(data.resolver)}
                      <CopyIcon />
                    </Button>
                  </Fade>
                }
              </Box>
              <Box display="flex" flexDir="column" w="min-content" gap={2}>
                <Text fontSize='sm' color="grey.200">Ownership</Text>
                {!data?.owner ?
                  <Skeleton height="2.5rem" w="7rem" rounded={8} /> :
                  <Fade in={!!data?.owner}>
                    <Button
                      id="owmer"
                      className="transition-all-05"
                      variant="outiline"
                      rounded={8}
                      p={2}
                      borderColor="grey.300"
                      borderWidth={1}
                      background="semi-transparent"
                      display="flex"
                      color="text.700"
                      gap={3}
                      _hover={{ background: 'transparent', transform: 'translate(0px, -3px)' }}
                      onClick={copy}
                    >
                      {shortString(data.owner)}
                      <CopyIcon />
                    </Button>
                  </Fade>
                }
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Center>
    </Center>
  )
}

export { Domain }
