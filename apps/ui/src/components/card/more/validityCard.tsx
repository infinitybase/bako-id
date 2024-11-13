import { Button, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';

import { Card } from '..';
import { DoubleArrowRightIcon } from '../..';
import { useGetGracePeriod } from '../../../hooks/useGetGracePeriod';

import { useSidebar } from '../../sidebar/hooks/useSidebar';
import { ValidityBody } from './validityBody';

export const ValidityCard = () => {
  const { domain } = useParams({ strict: false });
  const { isMyDomain } = useSidebar();
  const { data } = useGetGracePeriod(domain.replace('@', ''));

  if (!data) return null;

  return (
    <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '45rem']}>
      <CardHeader w="full">
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize="lg" color="grey.100">
            Validity
          </Heading>
          <Button
            variant="ghosted"
            color="grey.100"
            hidden
            _hover={{
              bgColor: 'transparent',
              color: 'button.500',
            }}
            rightIcon={<DoubleArrowRightIcon width={5} height={5} />}
            isDisabled={!isMyDomain}
            onClick={() => {}}
          >
            Extend
          </Button>
        </Flex>
      </CardHeader>
      <CardBody mt={4}>
        <ValidityBody
          timestamp={data.timestamp}
          gracePeriod={data.gracePeriod}
          period={data.period}
        />
      </CardBody>
    </Card>
  );
};
