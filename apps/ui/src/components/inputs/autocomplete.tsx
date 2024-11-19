import { isValidDomain } from '@bako-id/sdk';
import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  UnorderedList,
  type InputProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AvailableBadge,
  BakoTooltip,
  NotSupportedBadge,
  SearchingBadge,
  UnavailableBadge,
} from '..';
import { useHome } from '../../modules/home/hooks';
import { CloseIcon } from '../icons/closeIcon';
import { SearchIcon } from '../icons/searchIcon';

interface IAutocomplete extends InputProps {}

type AutocompleteValue = {
  handle: string;
};

export const Autocomplete = (props: IAutocomplete) => {
  const {
    handleChangeDomain,
    domainIsAvailable,
    handleConfirmDomain,
    isDisabled,
  } = useHome();
  const [inputValue, setInputValue] = useState<string>('');
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      handle: '',
    },
  });
  const onSubmit = () => {
    handleConfirmDomain();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const forbiddenCharacters = /[^a-zA-Z0-9-_]/g; // Special characters except letters, numbers, hyphens, and underscores
    const hasForbiddenCharacters = forbiddenCharacters.test(
      e.target.value.replace('@', ''), // Ignores first '@'
    );

    let inputValue = e.target.value
      .replace(/\s+/g, '') // Remove white spaces
      .replace(forbiddenCharacters, ''); // Remove forbidden characters

    if (inputValue && !inputValue.startsWith('@')) {
      inputValue = `@${inputValue}`; // Add "@" if not present
    }

    inputValue = inputValue.toLowerCase();

    setInputValue(inputValue);

    if (inputValue.length > 0) {
      const valid = isValidDomain(inputValue); // Check if the domain is valid
      trigger('handle'); // Trigger the handle again to revalidate after onChange

      if (!valid || hasForbiddenCharacters) return;
      if (inputValue.length > 3) handleChangeDomain(e);
    } else {
      setInputValue('');
    }
  };

  return (
    <Box w="full" h="full" display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isInvalid={!!errors?.handle && inputValue.length >= 0}
          display="flex"
          flexDirection="column"
        >
          <InputGroup
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Controller
              name="handle"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: 'You must type something' },
                minLength: {
                  value: 4,
                  message: 'Handle must be at least 3 characters long.',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="autocomplete"
                  value={inputValue}
                  color="white"
                  fontWeight="normal"
                  w="full"
                  fontSize={['xs', 'md']}
                  placeholder=" "
                  autoComplete="off"
                  textColor="text.700"
                  background="input.900"
                  type="text"
                  maxLength={31}
                  errorBorderColor="error.500"
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e);
                  }}
                  flex={1}
                  sx={{ _placeholder: { color: 'grey.200' } }}
                  {...props}
                />
              )}
            />
            <FormLabel isTruncated fontWeight="normal" maxW="80%" fontSize="sm">
              Search for an available Handle
            </FormLabel>

            <Flex
              h="10"
              display="flex"
              w="7rem"
              bottom={2}
              right={2}
              position="absolute"
              backgroundColor="input.900"
              alignItems="center"
              justifyContent="center"
            >
              {!inputValue && (
                <InputRightElement h={10} mt={1}>
                  <SearchIcon h={4} w={4} color="grey.100" />
                </InputRightElement>
              )}

              {inputValue.length > 0 && (
                <Flex w="full">
                  {inputValue.length < 4 ? (
                    <InputRightElement
                      zIndex={99}
                      right={5}
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
                      right={6}
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
                    <CloseIcon h={3} w={3} color="grey.100" />
                  </InputRightElement>
                </Flex>
              )}
            </Flex>
          </InputGroup>
          <Box h={9} w="full">
            {errors.handle?.message && inputValue.length <= 3 && (
              <FormErrorMessage
                w="full"
                color="error.500"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                {errors.handle.type === 'minLength' ? (
                  <BakoTooltip
                    w="full"
                    label={
                      <UnorderedList>
                        <ListItem>
                          Handle must be at least 3 characters and no longer
                          than 31.
                        </ListItem>
                        <ListItem>
                          Can be composed of letters, numbers, hyphens and
                          underlines.
                        </ListItem>
                        <ListItem>
                          No spaces or others special characters.
                        </ListItem>
                      </UnorderedList>
                    }
                  >
                    <InfoIcon w={3} h={3} color="section.200" mb={0.5} />
                  </BakoTooltip>
                ) : (
                  <Box />
                )}
                {errors.handle?.message}
              </FormErrorMessage>
            )}
          </Box>
        </FormControl>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          isDisabled={
            !!errors.handle?.message || domainIsAvailable === null || isDisabled
          }
          _disabled={{
            cursor: 'not-allowed',
            bgColor: 'button.500',
            opacity: 0.5,
            _hover: {
              bgColor: 'button.500',
              opacity: 0.5,
            },
          }}
        >
          Continue
        </Button>
      </form>
    </Box>
  );
};
