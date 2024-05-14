import { Flex, Skeleton } from '@chakra-ui/react';
import { Card } from '..';

export const AddressCardSkeleton = () => {
  return (
    <Card
      w="full"
      h={['45%', '45%', 'full', 'auto']}
      p={6}
      display="flex"
      backdropFilter="blur(7px)"
      flexDirection="column"
      gap={5}
    >
      <Flex alignItems="center" justify="space-between">
        <Skeleton w={32} h={8} rounded="md" />
        {/* {isMyDomain && (
          <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
            Add
          </Button>
        )} */}
      </Flex>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Skeleton w="full" h={9} rounded="lg" />
      </Flex>
    </Card>
  );
};
