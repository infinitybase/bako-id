import {
  Box,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
  // Button as ChakraButton,
  // useDisclosure,
  Divider,
  Stack, Button
} from '@chakra-ui/react';
import { DeleteIcon } from "@chakra-ui/icons";
import Add from "../../components/Add";
import { formatCoin } from "../../utils/formatter";
import { calculateDomainPrice } from "../../utils/calculator";
import { useState } from "react";
import { NumericInput, TextInput } from '../inputs';
import { Coin, Domains } from '../../types';

const { ETH } = Coin;

interface SelectPeriodProps {
  // selectedCoin: Coin;
  // setSelectedCoin: (coin: Coin) => void;
  networkFee: number;
  domain: string;
  onSubmit: () => void;
  name: string,
  isLoading: boolean
  walletExists: boolean
}

export function SetPeriod({ networkFee, onSubmit, name, isLoading, walletExists }: SelectPeriodProps) {
  // const { isOpen, onClose, onOpen } = useDisclosure();
  // const [domain, setDomain] = useState<string>("");
  const [items, setItems] = useState<Domains[]>([{
    name,
    period: 1
  }])

  const handlePeriodChange = (index: number, newValue: number) => {
    const newItems = [...items];
    // period not specified
    newItems[index] = { ...newItems[index], period: newValue };
    setItems(newItems);
  };

  // const handleDelete = (domain: string) => {
  //   const filteredItems = items.filter(({ name }) => name !== domain);
  //   setItems(filteredItems);
  // };

  const totalPrice = items.reduce(
    (previous, current) =>
      previous + calculateDomainPrice(current.name, 1),
    0
  );

  return (
      <Stack
        w="full"
        h="full"
        direction={{ base: "column", md: "row"  }}
        justifyContent='center'
        alignItems={{ base: 'center', md: 'start' }}
        gap={{ base: 6, md: 28, lg: 40 }}
        mt={2}
      >
        <VStack w="full" maxW="420px" alignItems="start">
          <Box w="full">
            <Text color="section.200" fontWeight={600} marginBottom={4}>
              Domains
            </Text>
            <VStack spacing={5}>
              {items.map(({ name }, index) => (
                <VStack w="full" key={name} spacing={5}>
                  {index > 0 && <Divider w="80%" borderColor="link.500" />}

                  <VStack w="full" spacing={0}>
                    <TextInput value={`${name}@`} />
                    <Flex
                      w="full"
                      border="none"
                      backgroundColor="input.500"
                      padding=".5rem .75rem"
                      marginTop=".5rem"
                      borderRadius={8}
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      <NumericInput
                        initialValue={1}
                        index={index}
                        onChange={handlePeriodChange}
                        key={0}
                      />
                      <Flex
                        gap={3}
                        alignItems="center"
                        w="80%"
                        justifyContent="flex-end"
                      >
                        <Text color="white" fontSize="sm">
                          {formatCoin(calculateDomainPrice(name, 1), ETH)}
                        </Text>
                        <DeleteIcon
                          cursor={"pointer"}
                          color="error.500"
                          // onClick={() => {
                          //   index === 0 && items.length === 1
                          //     ? backHome()
                          //     : handleDelete(name);
                          // }}
                        />
                      </Flex>
                    </Flex>
                  </VStack>
                </VStack>
              ))}
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
              onClick={() => {
                // setDomain("");
                // onOpen();
              }}
            />
          </Box>
        </VStack>
        <VStack
          h="full"
          w="full"
          maxW="420px"
          alignItems="start"
          spacing={4}
        >
          <Text color="section.200" fontWeight={600}>
            Your purchase
          </Text>
          <VStack
            w="full"
            bg="input.500"
            p=".5rem 1rem 1rem 1rem"
            borderRadius={8}
          >
            <HStack w="full">
              <Text fontSize="medium" fontWeight={600} color="white">
                {`${items.length} Domain`}
              </Text>
              <Spacer />
              {/* <HStack bg={"#35302F"} p={2} spacing={2} borderRadius={10}>
                <ChakraButton
                  w={12}
                  h={7}
                  onClick={() => setSelectedCoin(ETH)}
                  style={{
                    backgroundColor:
                      selectedCoin === ETH ? "#32C8D9" : "#2B2827",
                    color: selectedCoin === ETH ? "#1E1F22" : "#686361",
                  }}
                >
                  {ETH}
                </ChakraButton>
                <ChakraButton
                  border="none"
                  w={12}
                  h={7}
                  onClick={() => setSelectedCoin(USD)}
                  style={{
                    backgroundColor:
                      selectedCoin === USD ? "#32C8D9" : "#2B2827",
                    color: selectedCoin === USD ? "#1E1F22" : "#686361",
                  }}
                >
                  {USD}
                </ChakraButton>
              </HStack> */}
            </HStack>
            <VStack w="full" spacing={1} bg="#484240" p={3} borderRadius={10}>
              <Flex w="full" justifyContent="space-between">
                <Text color="text.500" fontSize="sm">
                  Domain
                </Text>
                <Text color="text.500" fontSize="sm">
                  {formatCoin(totalPrice, ETH)}
                </Text>
              </Flex>
              <Flex w="full" justifyContent="space-between">
                <Text color="text.500" fontSize="sm">
                  Estimated network fee
                </Text>
                <Spacer />
                <Text color="text.500" fontSize="sm">
                  {formatCoin(networkFee, ETH)}
                </Text>
              </Flex>
              <HStack w="full">
                <Text color="text.500" fontSize="sm" fontWeight="bold">
                  Estimated total
                </Text>
                <Spacer />
                <Text color="text.500" fontSize="sm" fontWeight="bold">
                  {formatCoin(totalPrice + networkFee, ETH)}
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <Box w="full" pb={10}>
            <Button
              w="full"
              isLoading={isLoading}
              isDisabled={!walletExists}
              onClick={onSubmit}
              background="button.500"
              color="background.500"
              fontSize={14}
              _hover={{ bgColor: 'button.600' }}
            >Buy</Button>
          </Box>
        </VStack>
      </Stack>
  );
}
