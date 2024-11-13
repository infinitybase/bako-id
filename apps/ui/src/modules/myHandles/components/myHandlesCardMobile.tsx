import type { IDRecord } from '@bako-id/sdk';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HandleCard } from './handleCard';
import { useNavigate } from '@tanstack/react-router';

interface IMyHandlesCardMobile {
  handles?: IDRecord[];
}

export const MyHandlesCardMobile = ({ handles }: IMyHandlesCardMobile) => {
  const navigate = useNavigate();
  return (
    <Center w="full" h="max-content" p={4}>
      <VStack w="full" align="flex-start">
        <Flex w="full" justifyContent="flex-start" flexDir="column" gap={2}>
          <Text fontSize="md" fontWeight="semibold">
            My Handles
          </Text>
          <Divider borderColor="stroke.500" />
        </Flex>

        <Box
          w="full"
          maxH="90vh"
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
                  It seems like you haven’t purchased any Hanfle yet.
                </Text>
                <Button variant="primary" onClick={() => navigate({ to: '/' })}>
                  Purchase
                </Button>
              </VStack>
            </VStack>
          )}
        </Box>
      </VStack>
    </Center>
  );
};
