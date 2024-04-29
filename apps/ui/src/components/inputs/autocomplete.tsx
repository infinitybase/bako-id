import { isValidDomain } from '@bako-id/sdk';
import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  type InputProps,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AvailableBadge, UnavailableBadge } from '..';
import { useHome } from '../../modules/home/hooks';
import { RightArrow } from '../icons/rightArrow';
import { SearchIcon } from '../icons/searchIcon';

interface IAutocomplete extends InputProps {}

export const Autocomplete = (props: IAutocomplete) => {
  const { handleChangeDomain, domainIsAvailable, handleConfirmDomain } =
    useHome();

  const [inputValue, setInputValue] = useState<string>('');
  const [option, setOption] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();

    if (inputValue.length > 0) {
      const valid = isValidDomain(inputValue);

      if (!valid) return;

      setInputValue(inputValue);
      handleChangeDomain(e);
    } else {
      setInputValue('');
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value);
    handleConfirmDomain(e);
  };

  useEffect(() => {
    setOption(inputValue);
  }, [inputValue]);

  return (
    <>
      <InputGroup display="flex" flexDirection="column" zIndex={99}>
        <Box w="full">
          <ChakraInput
            value={inputValue}
            color="white"
            fontWeight="normal"
            h={12}
            fontSize={['xs', 'md']}
            placeholder="Search for an available Handles"
            textColor="text.700"
            background="input.900"
            type="text"
            errorBorderColor="error.500"
            onChange={handleChange}
            border="1px solid"
            borderColor="grey.600"
            borderRadius={10}
            sx={{ _placeholder: { color: 'grey.200' } }}
            _focus={{}}
            _hover={{}}
            _focusVisible={{}}
            {...props}
          />

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
              value={`@${option}`}
              position="absolute"
              w="100%"
              maxH="200px"
              mt={2}
              borderRadius={10}
              textColor="text.700"
              background="input.900"
              border="1px solid"
              borderColor="grey.500"
              key={option}
              h={12}
              cursor="pointer"
              _hover={{ bgColor: 'background.400' }}
              onSelect={handleSelect}
              onMouseEnter={() => setIsHovered(true)} // Handle mouse enter
              onMouseLeave={() => setIsHovered(false)}
            />

            {domainIsAvailable !== null && (
              <InputRightElement
                position="absolute"
                zIndex={2}
                top={3}
                right={8}
                pointerEvents="none"
              >
                {domainIsAvailable ? (
                  <>
                    <AvailableBadge position="relative" />
                    {isHovered && <RightArrow w={3} h={3} ml={2} mr={2} />}
                  </>
                ) : (
                  <>
                    <UnavailableBadge position="relative" right={2} />
                    {isHovered && <RightArrow w={3} h={3} mr={3} />}
                  </>
                )}
              </InputRightElement>
            )}
          </InputGroup>
        )}
      </InputGroup>
    </>
  );
};
