import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import type { Handle } from '../../../types';
import { HandleCard } from './handleCard';

interface MyHandlesCard {
  handles?: Handle[];
}

export const MyHandlesCard = ({ handles }: MyHandlesCard) => {
  return (
    <Center w="full" h={['auto', '70%', 'xl', 'xl']} alignItems="center">
      <Card
        border="1px solid"
        borderColor="stroke.500"
        py={6}
        px={4}
        w={['95%', '45rem']}
        h="fit-content"
        backdropFilter={'blur(7px)'}
        maxH="lg"
        gap={2}
        alignSelf="center"
        display="flex"
        flexDir="column"
      >
        <CardHeader
          color="section.200"
          mx={3}
          fontSize="md"
          fontWeight="medium"
        >
          My Handles
          <Divider borderColor="stroke.500" mt={6} mb={-2} />
        </CardHeader>
        <CardBody
          w="full"
          maxH="lg"
          overflowY="scroll"
          overflowX="hidden"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0px',
              maxHeight: '300px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
            },
          }}
        >
          {handles ? (
            handles.map((handle) => <HandleCard handle={handle} />)
          ) : (
            <VStack spacing={3} my={3}>
              {[...Array(6)].map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Skeleton w="97%" height="14" rounded="lg" key={index} />
              ))}
            </VStack>
          )}
        </CardBody>
        <Box mx={3} mt={-2}>
          {/* Add verification if the handles quantity it's large then 5 to show the divider. */}
          <Divider w="full" borderColor="stroke.500" />
        </Box>
      </Card>
    </Center>
  );
};
