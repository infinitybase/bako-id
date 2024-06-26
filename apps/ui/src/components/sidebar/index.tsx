import {
  Box,
  Badge as ChakraBadge,
  Icon as ChakraIcon,
  Flex,
  Text,
  VStack,
  chakra,
  type BadgeProps,
  type FlexProps,
  type IconProps,
  type MergeWithAs,
  type TextProps,
} from '@chakra-ui/react';

const MenuItem = chakra(Flex, {
  baseStyle: {
    w: '100%',
    justifyContent: 'flex-start',
    gap: 4,
    alignItems: 'center',
    pb: 5,
    pt: 5,
  },
});

const Container = ({
  children,
  isActive,
  ...props
}: FlexProps & { isActive?: boolean }) => (
  <Box
    px={4}
    w="full"
    cursor="pointer"
    borderBottomWidth={1}
    borderColor={isActive ? 'brand.500' : 'transparent'}
  >
    <MenuItem {...props}>{children}</MenuItem>
  </Box>
);

const Icon = (props: MergeWithAs<IconProps, never>) => (
  <ChakraIcon fontSize={{ base: 'lg', sm: 'xl' }} {...props} />
);

const Title = ({ isActive, ...props }: TextProps & { isActive?: boolean }) => (
  <Text
    variant="subtitle"
    fontSize={{ base: 'md', sm: 'lg' }}
    fontWeight={isActive ? 'bold' : 'semibold'}
    {...props}
  />
);

const Badge = (props: BadgeProps) => (
  <ChakraBadge variant="warning" fontWeight="normal" {...props} />
);

const SidebarMenu = {
  Icon,
  Title,
  Badge,
  Container,
  List: chakra(VStack),
};

export { SidebarMenu };
