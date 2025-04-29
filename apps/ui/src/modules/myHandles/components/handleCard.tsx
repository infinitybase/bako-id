import { MetadataKeys, type IDRecord } from '@bako-id/sdk';
import {
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Skeleton,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { AvatarIcon } from '../../../components';
import { useMetadata } from '../../../hooks/useMetadata';
import type { Account } from 'fuels';

interface IHandleCard extends StackProps {
  handle: IDRecord;
  primaryHandle: string;
  isPrimaryHandleRequestLoading: boolean;
  wallet: Account | null;
}

export const HandleCard = ({
  primaryHandle,
  isPrimaryHandleRequestLoading,
  handle,
  wallet,
  ...rest
}: IHandleCard) => {
  const navigate = useNavigate();
  const { metadata, loadingMetadata } = useMetadata(undefined, handle.name);

  const avatar = metadata?.find((m) => m.key === MetadataKeys.AVATAR);
  const isOwner = wallet?.address.b256Address === handle.owner;
  const isLoading = isPrimaryHandleRequestLoading || loadingMetadata;
  const isPrimaryHandle = isOwner && primaryHandle === handle.name;

  const handleNavigate = (handle: string) => {
    navigate({ to: `/profile/${handle}` });
  };

  return (
    <Skeleton w="full" h="full" isLoaded={!isLoading} rounded="lg">
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
          {avatar?.value ? (
            <Box
              w={12}
              h={12}
              rounded="lg"
              bgImage={`url(${avatar.value})`}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
              border="1.5px solid"
              borderColor={'button.500'}
            />
          ) : (
            <Icon w={12} h={12} as={AvatarIcon} />
          )}

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
          {isPrimaryHandle && <Badge variant="info">Primary handle</Badge>}
          {/* <Button
                    variant="ghosted"
                    size="sm"
                    rightIcon={<DoubleArrowRightIcon />}
                    >
                    Extend
                    </Button> */}
        </Flex>
      </HStack>
    </Skeleton>
  );
};
