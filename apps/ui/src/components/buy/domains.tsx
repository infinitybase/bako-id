import { Box, VStack } from '@chakra-ui/react';
import { IChildren } from '../../types';

const Domains = ({ children }: IChildren) => {
  return (
    <Box w="full">
      <VStack spacing={5}>{children}</VStack>
      {/* <Add
      // onClick={() => {
      //   setDomain("");
      //   onOpen();
      // }}
      /> */}
    </Box>
  );
};

export { Domains };
