import { FormControl, FormHelperText, Icon, Text } from '@chakra-ui/react';

import { format } from 'date-fns';

import { formatTimeWithTimeZone } from '../../../utils/formatter';
import { ExploreIcon } from '../../icons/explore';
import { TextValue } from '../../inputs';

interface ValidityBodyProps {
  period: Date;
  gracePeriod: Date;
  timestamp: Date;
}

const ValidityBody = ({
  gracePeriod,
  period,
  timestamp,
}: ValidityBodyProps) => {
  return (
    <>
      <FormControl>
        <FormHelperText my={4} color="section.500">
          Name expires
        </FormHelperText>
        <TextValue
          leftAction={format(period, 'MMMM dd, yyyy')}
          leftColor="grey.100"
          color="section.500"
          justifyContent="start"
          content={formatTimeWithTimeZone(period)}
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
          leftAction={format(gracePeriod, 'MMMM dd, yyyy')}
          color="section.500"
          justifyContent="start"
          content={formatTimeWithTimeZone(gracePeriod)}
        />
      </FormControl>
      <FormControl>
        <FormHelperText my={4} color="section.500">
          Registered
        </FormHelperText>
        <TextValue
          leftColor="grey.100"
          leftAction={format(timestamp, 'MMMM dd, yyyy')}
          color="section.500"
          justifyContent="start"
          content={formatTimeWithTimeZone(timestamp)}
          rightAction={<Icon as={ExploreIcon} />}
        />
      </FormControl>
    </>
  );
};

export { ValidityBody };
