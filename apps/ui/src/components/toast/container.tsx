import {
  Box,
  HStack,
  Text,
  type AlertStatus,
  type UseToastOptions,
} from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  leftIcon: React.ReactNode;
  onClose: () => void;
  status: AlertStatus;
}

const colors = {
  bg: {
    success: 'success.900',
    error: 'error.900',
    warning: 'warning.900',
    info: 'info.900',
  },
  title: {
    success: 'brand.500',
    error: 'error.600',
    warning: 'warning.500',
    info: 'info.500',
  },
  description: {
    success: 'success.200',
    warning: 'warning.200',
    error: 'error.200',
    info: 'info.200',
  },
};

const Container = (props: ContainerProps) => {
  const [hide, setHide] = useState(false);

  return (
    <HStack
      px={5}
      py={3}
      spacing={3}
      boxShadow="lg"
      borderWidth={1}
      borderRadius={10}
      mt={1}
      borderColor={
        colors.bg[props?.status as keyof typeof colors.bg] ?? 'dark.100'
      }
      bg={colors.bg[props?.status as keyof typeof colors.bg] ?? 'dark.200'}
      whiteSpace="nowrap"
      overflow="hidden"
      position="relative"
      backdropFilter="blur(17px)"
      maxW={350}
      onClick={() => setHide(!hide)}
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      {props.leftIcon}
      <Box hidden={hide} overflow="hidden">
        {props.children}
      </Box>
    </HStack>
  );
};

interface ToastProps extends UseToastOptions {
  onClose: () => void;
}

const Toast = (props: ToastProps) => {
  return (
    <Container
      onClose={props.onClose}
      leftIcon={props.icon}
      status={props.status!}
    >
      <Text
        color={
          colors.title[props.status as keyof typeof colors.title] ?? 'brand.500'
        }
        fontWeight="semibold"
      >
        {props.title}
      </Text>
      <Text
        mt={2}
        fontSize={14}
        noOfLines={2}
        whiteSpace="pre-wrap"
        lineHeight={1}
        color={
          colors.description[props.status as keyof typeof colors.description] ??
          'grey.200'
        }
      >
        {props.description}
      </Text>
    </Container>
  );
};

export { Toast };
