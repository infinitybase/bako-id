import {
  Button,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Card } from '..';
import { DoubleArrowRightIcon, TextValue } from '../..';
import { useGetGracePeriod } from '../../../hooks/useGetGracePeriod';
import { formatTimeWithTimeZone } from '../../../utils/formatter';
import { ExploreIcon } from '../../icons/explore';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ValidityCard = () => {
  const { domain } = useParams({ strict: false });
  const { isMyDomain } = useSidebar();
  const { data } = useGetGracePeriod(domain.replace('@', ''));

  if (!data) return null;

  const ValidityBody = () => {
    return (
      <>
        <FormControl>
          <FormHelperText my={4} color="section.500">
            Name expires
          </FormHelperText>
          <TextValue
            leftAction={format(data.period, 'MMMM dd, yyyy')}
            leftColor="grey.100"
            color="section.500"
            justifyContent="start"
            content={formatTimeWithTimeZone(data.period)}
          />
        </FormControl>
        <FormControl my={4}>
          <FormHelperText
            display="flex"
            flexDirection="row"
            w="full"
            justifyContent="space-between"
            color="section.500"
            my={4}
          >
            <Text>Grace period ends</Text>
            <Icon
              w={4}
              h={4}
              mr={2}
              _hover={{
                cursor: 'pointer',
              }}
              color="grey.100"
            />
          </FormHelperText>
          <TextValue
            leftColor="grey.100"
            leftAction={format(data.gracePeriod, 'MMMM dd, yyyy')}
            color="section.500"
            justifyContent="start"
            content={formatTimeWithTimeZone(data.gracePeriod)}
          />
        </FormControl>
        <FormControl>
          <FormHelperText my={4} color="section.500">
            Registered
          </FormHelperText>
          <TextValue
            leftColor="grey.100"
            leftAction={format(data.timestamp, 'MMMM dd, yyyy')}
            color="section.500"
            justifyContent="start"
            content={formatTimeWithTimeZone(data.timestamp)}
            rightAction={<Icon as={ExploreIcon} />}
          />
        </FormControl>
      </>
    );
  };

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
        <ValidityBody />
      </CardBody>
    </Card>
  );
};
