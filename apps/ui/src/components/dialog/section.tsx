import { Divider, type StackProps, Text, VStack } from '@chakra-ui/react';
import type React from 'react';

export interface DialogSectionProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const DialogSection = ({
  title,

  children,
  ...stackProps
}: DialogSectionProps) => (
  <VStack spacing={1} alignItems="flex-start" {...stackProps}>
    <Text w="90%" fontSize={{ base: 'sm', sm: 'md' }} color="grey.100">
      {title}
    </Text>
    <Divider w="full" />

    {children}
  </VStack>
);

export { DialogSection };
