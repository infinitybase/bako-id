import { Box, type BoxProps } from '@chakra-ui/react';

interface IDialogBody extends BoxProps {}

const DialogBody = ({ children, ...rest }: IDialogBody) => (
  <Box w="full" {...rest}>
    {children}
  </Box>
);

export { DialogBody };
