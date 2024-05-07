import { isValidDomain } from '@bako-id/sdk';
import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  type InputProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  AvailableBadge,
  NotSupportedBadge,
  SearchingBadge,
  UnavailableBadge,
} from '..';
import { useHome } from '../../modules/home/hooks';

interface IAutocomplete extends InputProps {}

export const Autocomplete = (props: IAutocomplete) => {
  const { handleChangeDomain, domainIsAvailable, handleConfirmDomain } =
    useHome();

  const [inputValue, setInputValue] = useState<string>('');

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

      if (inputValue.length > 4) {
        handleChangeDomain(e);
      }
    } else {
      setInputValue('');
    }
  };

  return (
    <>
      <FormControl>
        <InputGroup
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Input
            variant="custom"
            value={inputValue}
            color="white"
            fontWeight="normal"
            h={12}
            w="full"
            fontSize={['xs', 'md']}
            placeholder=" "
            autoComplete="off"
            textColor="text.700"
            background="input.900"
            type="text"
            maxLength={31}
            errorBorderColor="error.500"
            onChange={handleChange}
            border="1px solid"
            borderColor="grey.600"
            borderRight="none"
            borderRightRadius="0"
            borderLeftRadius={10}
            flex={1}
            sx={{ _placeholder: { color: 'grey.200' } }}
            _focus={{}}
            _hover={{}}
            _focusVisible={{}}
            {...props}
          />
          <FormLabel isTruncated>Search for an available Handles</FormLabel>

          <Flex
            h="10"
            display="flex"
            w="7rem"
            bottom={2}
            right={1}
            position="absolute"
            backgroundColor="input.900"
            alignItems="center"
            justifyContent="center"
          >
            {!inputValue && (
              <InputRightElement h={10} mt={1}>
                <SearchIcon h={5} w={5} mr={[1, 4]} color="grey.100" />
              </InputRightElement>
            )}

            {inputValue.length > 0 && (
              <Flex w="full">
                {inputValue.length <= 4 ? (
                  <InputRightElement
                    zIndex={99}
                    right={7}
                    h={10}
                    mt={1}
                    pr={3}
                    w="full"
                    alignItems="center"
                    bgColor="input.900"
                    pointerEvents="none"
                  >
                    <NotSupportedBadge />
                  </InputRightElement>
                ) : (
                  <InputRightElement
                    zIndex={99}
                    right={7}
                    h={10}
                    mt={1}
                    pr={3}
                    w="full"
                    alignItems="center"
                    bgColor="input.900"
                    pointerEvents="none"
                  >
                    {domainIsAvailable === null ? (
                      <SearchingBadge />
                    ) : domainIsAvailable ? (
                      <AvailableBadge />
                    ) : (
                      <UnavailableBadge right={2} />
                    )}
                  </InputRightElement>
                )}
                <InputRightElement
                  zIndex={99}
                  h={10}
                  mt={1}
                  mr={1}
                  w="8"
                  alignItems="center"
                  bgColor="input.900"
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                  onClick={() => setInputValue('')}
                >
                  <SmallCloseIcon h={5} w={5} mr={[1, 4]} color="grey.100" />
                </InputRightElement>
              </Flex>
            )}
          </Flex>
        </InputGroup>
      </FormControl>
    </>
  );
};
