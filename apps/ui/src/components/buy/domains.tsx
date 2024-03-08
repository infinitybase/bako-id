import { Box, Text, VStack } from '@chakra-ui/react';
import { IChildren } from '../../types';
import Add from '../Add';

const Domains = ({ children }: IChildren) => {
  return (
    <Box w="full">
      <Text color="section.200" fontWeight={600} marginBottom={4}>
        Domains
      </Text>
      <VStack spacing={5}>
        {children}
      </VStack>
      {/*<Modal*/}
      {/*  domain={domain}*/}
      {/*  setDomain={setDomain}*/}
      {/*  items={items}*/}
      {/*  setItems={setItems}*/}
      {/*  isOpen={isOpen}*/}
      {/*  onClose={onClose}*/}
      {/*/>*/}
      <Add
        // onClick={() => {
        //   setDomain("");
        //   onOpen();
        // }}
      />
    </Box>
  )
}

export { Domains }
