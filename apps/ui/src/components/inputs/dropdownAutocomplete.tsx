import { isValidDomain } from '@bako-id/sdk';
import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Input as ChakraInput,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  type InputProps,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  AvailableBadge,
  NotSupportedBadge,
  SearchingBadge,
  UnavailableBadge,
} from '..';
import { useHome } from '../../modules/home/hooks';
import { SearchIcon } from '../icons/searchIcon';

interface IAutocomplete extends InputProps {}

export const DropdownAutocomplete = (props: IAutocomplete) => {
  const { handleChangeDomain, domainIsAvailable, handleConfirmDomain } =
    useHome();

  const [inputValue, setInputValue] = useState<string>('');
  const [option, setOption] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (inputValue && !inputValue.startsWith('@')) {
      inputValue = `@${inputValue}`;
    }

    inputValue = inputValue.toLowerCase();

    setInputValue(inputValue);

    if (inputValue.length > 0) {
      const valid = isValidDomain(inputValue);
      if (!valid) return;

      handleChangeDomain(e);
    } else {
      setInputValue('');
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value);
    handleConfirmDomain();
  };

  useEffect(() => {
    setOption(inputValue);
  }, [inputValue]);

  return (
    <>
      <FormControl>
        <InputGroup display="flex" flexDirection="column" zIndex={99}>
          <Box w="full">
            <ChakraInput
              value={inputValue}
              color="white"
              variant="autocomplete"
              fontWeight="normal"
              autoComplete="off"
              h={12}
              fontSize={['xs', 'md']}
              placeholder=" "
              textColor="text.700"
              background="input.900"
              type="text"
              errorBorderColor="error.500"
              onChange={handleChange}
              border="1px solid"
              borderColor="grey.600"
              borderRadius={10}
              sx={{ _placeholder: { color: 'grey.200' } }}
              {...props}
            />
            <FormLabel>Search for an available Handle</FormLabel>

            {!inputValue && (
              <InputRightElement h={12}>
                <SearchIcon h={5} w={5} mr={[1, 4]} color="grey.100" />
              </InputRightElement>
            )}
            {inputValue && (
              <InputRightElement
                _hover={{
                  cursor: 'pointer',
                  opacity: 0.8,
                }}
                onClick={() => setInputValue('')}
                h={12}
              >
                <SmallCloseIcon h={5} w={5} mr={[1, 4]} color="grey.100" />
              </InputRightElement>
            )}
          </Box>

          {inputValue && (
            <InputGroup zIndex={1} position="relative">
              <ChakraInput
                value={`${option}`}
                position="absolute"
                variant="custom"
                w="100%"
                maxH="200px"
                h={12}
                mt={2}
                isDisabled={
                  inputValue.length <= 3 || domainIsAvailable === null
                }
                textAlign="start"
                borderRadius={10}
                textColor="text.700"
                background="input.900"
                border="1px solid"
                borderColor="grey.500"
                key={option}
                cursor="pointer"
                _hover={{ bgColor: 'background.400' }}
                onSelect={handleSelect}
                _focus={{}}
                _active={{}}
              />

              {inputValue.length > 0 && (
                <Flex>
                  {inputValue.length < 4 ? (
                    <InputRightElement
                      position="absolute"
                      top={3}
                      zIndex={99}
                      right={10}
                      h={10}
                      pointerEvents="none"
                    >
                      <NotSupportedBadge />
                    </InputRightElement>
                  ) : (
                    <>
                      {domainIsAvailable === null ? (
                        <InputRightElement
                          position="absolute"
                          zIndex={99}
                          top={3}
                          right={10}
                          h={10}
                          pointerEvents="none"
                        >
                          <SearchingBadge />
                        </InputRightElement>
                      ) : domainIsAvailable ? (
                        <InputRightElement
                          position="absolute"
                          zIndex={99}
                          top={3}
                          right={7}
                          h={10}
                          pointerEvents="none"
                        >
                          <AvailableBadge />
                        </InputRightElement>
                      ) : (
                        <InputRightElement
                          position="absolute"
                          zIndex={99}
                          top={3}
                          right={8}
                          h={10}
                          pointerEvents="none"
                        >
                          <UnavailableBadge right={2} />
                        </InputRightElement>
                      )}
                    </>
                  )}
                </Flex>
              )}
            </InputGroup>
          )}
        </InputGroup>
      </FormControl>
    </>
  );
};
