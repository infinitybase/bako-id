import type { IDRecord } from '@bako-id/sdk';
import { Flex, HStack, Icon, type StackProps, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { AvatarIcon } from '../../../components';

interface IHandleCard extends StackProps {
  handle: IDRecord;
}

export const HandleCard = ({ handle, ...rest }: IHandleCard) => {
  const navigate = useNavigate();

  const handleNavigate = (handle: string) => {
    navigate({ to: `/profile/${handle}` });
  };

  return (
    <HStack
      key={handle.name}
      zIndex={1}
      display="flex"
      cursor="pointer"
      justifyContent="space-between"
      bgColor="gradient.200"
      rounded="lg"
      mb={3}
      mx={3}
      p={2}
      px={4}
      _hover={{
        transform: 'scale(1.02)',
        transition: 'all 0.3s ease-out',
        bgColor: 'grey.600',
      }}
      css={{
        '&:first-child': {
          marginTop: '1rem',
        },
        '&:last-child': {
          marginBottom: '1rem',
        },
      }}
      onClick={() => handleNavigate(handle.name)}
      {...rest}
    >
      <Flex align="center" gap={3}>
        <Icon w={12} h={12} as={AvatarIcon} />
        <Flex direction="column">
          <Text fontSize="sm" fontWeight="medium">
            {handle.name}
          </Text>
          {/* <Text fontSize="xs" color="section.500" variant="description">
            {handle.expiry}
          </Text> */}
        </Flex>
      </Flex>
      <Flex gap={4} align="center">
        {/*{handle.isPrimary && <Badge variant="info">Primary</Badge>}*/}
        {/* <Button
                    variant="ghosted"
                    size="sm"
                    rightIcon={<DoubleArrowRightIcon />}
                  >
                    Extend
                  </Button> */}
      </Flex>
    </HStack>
  );
};
