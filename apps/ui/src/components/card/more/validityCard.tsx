import { Button, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';

import { Card } from '..';
import { DoubleArrowRightIcon } from '../..';
import { useGetGracePeriod } from '../../../hooks/useGetGracePeriod';

import { RegistryContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useSidebar } from '../../sidebar/hooks/useSidebar';
import { ValidityBody } from './validityBody';

export const ValidityCard = () => {
  const { domain } = useParams({ strict: false });
  const { isMyDomain } = useSidebar();
  const { data } = useGetGracePeriod(domain.replace('@', ''));
  const { provider } = useProvider();

  const { data: dates } = useQuery({
    queryKey: ['getDates', domain],
    queryFn: async () => {
      let registryContract: RegistryContract;

      if (provider) {
        registryContract = RegistryContract.create(provider);
      } else {
        const provider = await Provider.create(
          import.meta.env.VITE_PROVIDER_URL
        );
        registryContract = RegistryContract.create(provider);
      }

      const { ttl, timestamp } = await registryContract.getDates(domain);
      const gracePeriod = new Date(ttl);
      gracePeriod.setDate(gracePeriod.getDate() + 90);

      return { ttl, timestamp, gracePeriod };
    },
    enabled: !!domain,
  });

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
          timestamp={dates?.timestamp}
          gracePeriod={dates?.gracePeriod}
          ttl={dates?.ttl}
        />
      </CardBody>
    </Card>
  );
};
