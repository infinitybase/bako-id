import type { IDRecord } from '@bako-id/sdk';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HandleCard } from './handleCard';
import { useNavigate } from '@tanstack/react-router';

interface MyHandlesCard {
  handles?: IDRecord[];
  isLoading: boolean;
}

export const MyHandlesCard = ({ handles, isLoading }: MyHandlesCard) => {
  const navigate = useNavigate();
  return (
    <Center w="full" minH="70%" h="auto" alignItems="center">
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
          <Skeleton isLoaded={!isLoading} minH="200px" rounded="lg">
            {handles?.length ? (
              handles.map((handle) => (
                <HandleCard key={handle.name} handle={handle} />
              ))
            ) : (
              <VStack mt={4} h="282px" placeContent="center">
                <VStack
                  minH="90px"
                  maxW="172px"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  spacing={6}
                >
                  <Text color="grey.200" fontSize="xs">
                    It seems like you haven’t purchased any Handle yet.
                  </Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate({ to: '/' })}
                  >
                    Purchase
                  </Button>
                </VStack>
              </VStack>
            )}
          </Skeleton>
        </CardBody>
        <Box mx={3} mt={-2}>
          {/* Add verification if the handles quantity it's large then 5 to show the divider. */}
          {handles?.length ? (
            <Divider w="full" borderColor="stroke.500" />
          ) : null}
        </Box>
      </Card>
    </Center>
  );
};
