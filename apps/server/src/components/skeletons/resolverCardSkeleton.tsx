import {
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { Card } from '../card';

export const ResolverCardSkeleton = () => {
  return (
    <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '45rem']}>
      <CardHeader w="full">
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize="lg" color="grey.100">
            Resolver
          </Heading>
          <Skeleton w="full" h={10} rounded="lg" />
        </Flex>
      </CardHeader>
      <CardBody mt={4}>
        <Skeleton w="full" h={9} rounded="lg" />
      </CardBody>
    </Card>
  );
};
