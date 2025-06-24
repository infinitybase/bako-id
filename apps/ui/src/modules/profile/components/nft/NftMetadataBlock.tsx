import { CopyText } from '@/components/helpers/copy';
import { formatAddress, isUrl } from '@/utils/formatter';
import { Box, Flex, type FlexProps, Icon, Text } from '@chakra-ui/react';
import { isB256 } from 'fuels';
import type { ReactNode } from 'react';

export const NftMetadataBlock = ({
  value,
  title,
  isCopy,
  icon,
  ...rest
}: {
  value: string;
  title: string;
  icon?: ReactNode;
  isCopy?: boolean;
} & FlexProps) => (
  <Flex
    flex={1}
    minW="fit-content"
    w="full"
    p={2}
    gap={2}
    alignItems="center"
    borderRadius="md"
    background="input.600"
    position="relative"
    _before={
      isUrl(value) && ['image', 'avatar'].includes(title.toLowerCase())
        ? {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0.2,
            backgroundImage: `url('${value}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: 'md',
          }
        : ''
    }
    {...rest}
  >
    {icon && <Icon fontSize={25}>{icon}</Icon>}
    <Box>
      <Text fontSize="xs" color="section.500">
        {title}
      </Text>
      <Flex gap={2}>
        <Text fontSize="xs" overflowWrap="anywhere">
          {isB256(value!) ? formatAddress(value!, 9) : value}
        </Text>
        {isCopy && <CopyText value={value!} />}
      </Flex>
    </Box>
  </Flex>
);
