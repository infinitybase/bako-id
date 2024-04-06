import { Divider, StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';

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
