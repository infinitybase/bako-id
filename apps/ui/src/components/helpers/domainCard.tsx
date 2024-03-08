import { Box, Button, Card, CardBody, Fade, Flex, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import { formatAddress } from '../../utils/formatter.ts';
import { CopyIcon } from '@chakra-ui/icons';

interface DomainCardProps {
  domain: { name: string, resolver: string, owner: string } | null,
  isList?: boolean,
  copy: (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const DomainCard = ({ domain, isList, copy }: DomainCardProps) => {
  return (
    <Card background="background.600" w='full' maxW="2xl" boxShadow="lg" className="scale-up-hor-center">
      <CardBody display="flex" flexDir={ isList ? 'row' : 'column' } justifyContent="space-between">
        <Flex alignItems="center" gap={6}>
          <Box rounded={50} w={ isList ? '4em' : '6em' } h={ isList ? '4em' : '6em' } bgGradient="linear(to-br, #FFC010, #B24F18)"></Box>
          {!domain?.name ?
            <Flex flexDir="column" gap={2}>
              <Skeleton height="1rem" w="7rem" />
              <Skeleton height="1rem" w="2rem" />
            </Flex>
            :
            <Fade in={!!domain?.name}>
              <Flex flexDir="column" gap={2}>
                <Heading size='md' color="text.700">{domain.name}</Heading>
                <Text fontSize='xs' color="grey.200">Fuel</Text>
              </Flex>
            </Fade>
          }
        </Flex>
        <Stack mt='6' spacing='3' direction={ isList ? 'row' : 'column' } justifyContent="start">
          <Box display="flex" flexDir="column" w="min-content" gap={2}>
            <Text fontSize='sm' color="grey.200">Addresses</Text>
            {!domain?.resolver ?
              <Skeleton height="2.5rem" w="7rem" rounded={8} /> :
              <Fade in={!!domain?.resolver}>
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
                  {formatAddress(domain.resolver)}
                  <CopyIcon />
                </Button>
              </Fade>
            }
          </Box>
          <Box display="flex" flexDir="column" w="min-content" gap={2}>
            <Text fontSize='sm' color="grey.200">Ownership</Text>
            {!domain?.owner ?
              <Skeleton height="2.5rem" w="7rem" rounded={8} /> :
              <Fade in={!!domain?.owner}>
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
                  {formatAddress(domain.owner)}
                  <CopyIcon />
                </Button>
              </Fade>
            }
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}
