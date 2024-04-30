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
import { Card } from '..';
import { TextValue } from '../..';
import { DoubleArrowRightIcon } from '../../icons/doubleArrowRightIcon';
import { ExploreIcon } from '../../icons/explore';
import { LeftAddon } from '../../inputs/leftAddon';
import { RightAddon } from '../../inputs/rightAddon';
import { useSidebar } from '../../sidebar/hooks/useSidebar';

export const ValidityCard = () => {
  const { isMyDomain } = useSidebar();

  return (
    <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '90%']}>
      <CardHeader w="full">
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize="lg" color="grey.100">
            Validity
          </Heading>
          <Button
            variant="ghosted"
            color="grey.100"
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
        <FormControl>
          <FormHelperText my={4} color="section.500">
            Name expires
          </FormHelperText>
          <TextValue
            leftAction={
              <LeftAddon
                color="grey.100"
                w={['45%', '20%']}
                value="march 31, 2024"
              />
            }
            color="section.500"
            justifyContent="start"
            content="18:48:23 GMT"
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
            leftAction={
              <LeftAddon
                color="grey.100"
                w={['45%', '20%']}
                value="april 30, 2024"
              />
            }
            color="section.500"
            justifyContent="start"
            content="23:59:59 GMT +1"
          />
        </FormControl>
        <FormControl>
          <FormHelperText my={4} color="section.500">
            Registered
          </FormHelperText>
          <TextValue
            leftAction={
              <LeftAddon
                color="grey.100"
                w={['45%', '20%']}
                value="march 31, 2024"
              />
            }
            color="section.500"
            justifyContent="start"
            content="8:48:23"
            rightAction={<RightAddon value={<Icon as={ExploreIcon} />} />}
          />
        </FormControl>
      </CardBody>
    </Card>
  );
};
