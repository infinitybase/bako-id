import {
  Button as ChakraButton,
  Text,
  Icon,
  ButtonProps,
} from "@chakra-ui/react";
import { PlusSquareIcon } from '@chakra-ui/icons';

interface AddProps extends ButtonProps {}

export default function Add(props: AddProps) {
  return (
    <ChakraButton
      w="full"
      marginTop="2rem"
      leftIcon={<Icon fontSize={18} as={PlusSquareIcon} />}
      justifyContent="center"
      alignItems="center"
      backgroundColor="inherit"
      border="1px solid"
      borderColor="button.700"
      color="#32C8D9"
      fontSize="14px"
      _hover={{ bgColor: "button.700", color: "white" }}
      {...props}
    >
      <Text>Add more domains</Text>
    </ChakraButton>
  );
}
