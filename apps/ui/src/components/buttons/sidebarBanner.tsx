import {
  Box,
  Icon,
  Text,
  type BoxProps,
  type ComponentWithAs,
  type IconProps,
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
      gap={3}
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
        bgColor="background.900"
        borderLeftRadius="xl"
        style={{
          boxShadow: '3px 0px 4px rgba(0, 0, 0, .5)',
        }}
        h={16}
        w={20}
        {...props}
      >
        <Icon color={props.iconColor} as={props.icon} h={8} w={8} />
      </Box>
      <Text
        w="full"
        fontSize="sm"
        color="section.200"
        fontWeight="normal"
        whiteSpace="pretty"
      >
        {props.text}
      </Text>
    </Box>
  );
};
