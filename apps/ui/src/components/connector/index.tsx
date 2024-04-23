import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
  type DrawerProps,
} from '@chakra-ui/react';
import type React from 'react';
import { useCallback, useMemo } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import { Card } from '../';

type ConnectorType = {
  name: string;
  icon?: React.ElementType;
  imageUrl?: string;
  isEnabled?: boolean;
  isBeta?: boolean;
};

interface DrawerConnectorProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {
  connectors: ConnectorType[];
  onSelect: (connector: string) => void;
}

interface ConnectorCardProps {
  connector: ConnectorType;
  onClick: (connector: string) => void;
}

const CardConnector = (props: ConnectorCardProps) => {
  const { connector, onClick } = props;

  const ConnectorIcon = useMemo(() => {
    if (connector.imageUrl) {
      return (
        <Avatar
          color="white"
          size="sm"
          bgColor="transparent"
          variant="roundedSquare"
          src={connector.imageUrl}
          name={connector.name}
        />
      );
    }

    if (connector.icon) {
      return <Icon as={connector.icon} fontSize="4xl" />;
    }

    return null;
  }, [connector]);

  const selectConnector = useCallback(() => {
    if (!connector.isEnabled) return;
    onClick(connector.name);
  }, [connector.isEnabled, connector.name, onClick]);

  return (
    <Card
      as={HStack}
      w="100%"
      gap={4}
      cursor={connector.isEnabled ? 'pointer' : 'initial'}
      bgColor="background.300"
      borderColor="grey.300"
      onClick={selectConnector}
      position="relative"
      _hover={{
        borderColor: 'button.500',
      }}
    >
      <Box
        w="full"
        h="full"
        top={0}
        left={0}
        hidden={connector.isEnabled}
        position="absolute"
        borderRadius={10}
        backgroundColor="#121212a8"
      />
      {ConnectorIcon}
      <Box flex={1}>
        <Heading
          fontSize={{ base: 'md', sm: 'lg' }}
          fontWeight="semibold"
          color="grey.200"
        >
          {connector.name}
        </Heading>
      </Box>

      {connector.isBeta && (
        <Badge variant="gray" px={3.5} py={0.5}>
          Beta
        </Badge>
      )}
    </Card>
  );
};

const DrawerConnector = (props: DrawerConnectorProps) => {
  const { connectors, onSelect, ...drawerProps } = props;

  return (
    <Drawer
      {...drawerProps}
      size={{
        base: 'full',
        sm: 'sm',
      }}
      variant="solid"
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent maxH="full">
        <DrawerHeader mb={4}>
          <VStack alignItems="flex-start" spacing={2}>
            <HStack
              w="full"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              onClick={drawerProps.onClose}
              zIndex={1}
            >
              <Heading
                fontSize={{ base: 'lg', sm: 'xl' }}
                fontWeight="semibold"
              >
                Connect your Wallet
              </Heading>
              <CloseIcon w={3} h={3} />
            </HStack>
            <Text color="grey.100" fontSize="small" fontWeight="medium">
              Select your preferred access mode
            </Text>
          </VStack>
        </DrawerHeader>

        <Divider borderColor="grey.300" mb={8} />

        <DrawerBody>
          <VStack spacing={4}>
            {connectors.map((connector) => (
              <CardConnector
                key={connector.name}
                connector={connector}
                onClick={onSelect}
              />
            ))}
          </VStack>
        </DrawerBody>

        <DrawerFooter justifyContent="flex-start" pl={0}>
          <VStack alignItems="flex-start">
            <Heading fontSize="md" fontWeight="semibold" color="grey.100">
              New to Fuel network?
            </Heading>
            <Text fontSize="sm" color="grey.200">
              Fuel is the {`world's`} fastest modular execution layer.
            </Text>
            <Link
              fontSize="xs"
              color="brand.400"
              href="https://www.fuel.network/"
              target="_blank"
            >
              Learn more about Fuel
            </Link>
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerConnector };
