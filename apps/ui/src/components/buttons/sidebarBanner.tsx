import {
  Box,
  type BoxProps,
  type ComponentWithAs,
  Icon,
  type IconProps,
  Text,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons/lib';

interface SidebarBannerProps extends BoxProps {
  icon: ComponentWithAs<'svg', IconProps> | IconType;
  text: string;
  iconColor?: string;
  onClick?: () => void;
}

export const SidebarBanner = (props: SidebarBannerProps) => {
  return (
    <Box
      w="full"
      bgColor="input.600"
      borderRadius="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={6}
      h={16}
      _hover={{
        cursor: 'pointer',
        opacity: 0.8,
      }}
      onClick={props.onClick}
    >
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        bgColor="black"
        borderLeftRadius="xl"
        h={16}
        w={24}
        {...props}
      >
        <Icon color={props.iconColor} as={props.icon} h={9} w={9} />
      </Box>
      <Text w="full" fontSize="xs" color="section.200" whiteSpace="pretty">
        {props.text}
      </Text>
    </Box>
  );
};
