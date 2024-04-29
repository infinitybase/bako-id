import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  type BoxProps,
  type ComponentWithAs,
  type IconProps,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons/lib';
import { ExploreIcon } from '../icons/explore';

interface BakoSafeBannerProps extends BoxProps {
  icon: ComponentWithAs<'svg', IconProps> | IconType;
}

export const BakoSafeBanner = (props: BakoSafeBannerProps) => {
  return (
    <Box
      w="full"
      bgColor="input.600"
      borderRadius="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="auto"
      p={4}
      gap={2}
      _hover={{
        cursor: 'pointer',
      }}
      onClick={props.onClick}
    >
      <Flex gap={2} w="75%" flexDir="column">
        <Icon color="black" as={props.icon} h={12} w={32} />
        <Text w="full" fontSize="sm" color="section.200" whiteSpace="pretty">
          The ultimate Multisig Wallet experience
        </Text>
      </Flex>
      <Button
        variant="outline"
        color="grey.200"
        fontSize={['xs', 'sm']}
        rightIcon={<ExploreIcon w={4} h={4} />}
        _hover={{
          bgColor: 'initial',
          color: 'white',
          borderColor: 'button.500',
        }}
      >
        Try now
      </Button>
    </Box>
  );
};
