import {
  Box,
  Button,
  Divider,
  HStack,
  type BoxProps,
  type ButtonProps,
} from '@chakra-ui/react';

export interface DialogActionsProps extends BoxProps {
  hideDivider?: boolean;
}
export interface DialogActionProps extends ButtonProps {}

const DialogActions = ({
  children,
  hideDivider,
  ...rest
}: DialogActionsProps) => (
  <Box w="full" {...rest}>
    <Divider hidden={hideDivider} my={[3, 6]} />
    <HStack spacing={4} justifyContent="center">
      {children}
    </HStack>
  </Box>
);

const DialogPrimaryAction = (props: DialogActionProps) => (
  <Button
    w="full"
    variant="primary"
    _disabled={{
      bg: 'button.500',
      opacity: '.6',
      cursor: 'not-allowed',
      _hover: { bgColor: 'button.600' },
    }}
    {...props}
  />
);

const DialogSecondaryAction = (props: DialogActionProps) => (
  <Button
    w="full"
    variant="secondary"
    bgColor="transparent"
    border="1px solid white"
    _hover={{
      borderColor: 'button.500',
      color: 'button.500',
    }}
    {...props}
  />
);

const DialogTertiaryAction = (props: DialogActionProps) => (
  <Button variant="tertiary" bgColor="error.900" border="none" {...props} />
);

export {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
  DialogTertiaryAction,
};
