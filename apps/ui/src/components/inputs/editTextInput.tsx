import type { Metadata } from '@bako-id/sdk';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  type InputProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from '../dialog';
import { CloseIcon } from '../icons/closeIcon';
import { TrashIcon } from '../icons/trashIcon';

interface IEditTextValueInput extends InputProps {
  title: string;
  modalType: string;
  onSave: (metadata: Metadata) => Promise<void>;
  onClose: () => void;
}

type EditTextValueInput = {
  title: string;
};

export const EditTextValueInput = (props: IEditTextValueInput) => {
  const [inputValue, setInputValue] = useState<string>(props.title ?? '');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTextValueInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
    },
  });

  const handleSave = () => {
    props
      .onSave({
        key: props.modalType,
        value: inputValue,
      })
      .then(
        () => props.onClose(),
        (error) => console.error(error),
      );
    setInputValue('');
  };

  return (
    <Box w="full" h="full" display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(handleSave)}>
        <FormControl
          isInvalid={!!errors?.title && inputValue.length >= 0}
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
              name="title"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: 'You must type something' },
                minLength: {
                  value: 3,
                  message: `${props.modalType} must be at least 3 characters long.`,
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
                  textColor="text.700"
                  background="input.900"
                  type="text"
                  maxLength={31}
                  h={12}
                  errorBorderColor="error.500"
                  onChange={(e) => {
                    field.onChange(e);
                    setInputValue(e.target.value);
                  }}
                  flex={1}
                  sx={{ _placeholder: { color: 'grey.200' } }}
                  {...props}
                />
              )}
            />
            <FormLabel isTruncated fontWeight="normal" maxW="80%" fontSize="sm">
              {props.modalType.charAt(0).toUpperCase() +
                props.modalType.slice(1)}
            </FormLabel>

            {inputValue.length > 0 && (
              <InputRightElement
                zIndex={99}
                top={1}
                right={2}
                w="8"
                position="absolute"
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
            )}
          </InputGroup>
          <FormHelperText
            position="absolute"
            bottom={2}
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="end"
          >
            <Flex
              gap={1}
              alignItems="center"
              color="section.200"
              _hover={{
                cursor: 'pointer',
                color: 'button.500',
              }}
              onClick={() => setInputValue('')}
            >
              <Text fontSize="sm" fontWeight={400}>
                Delete
              </Text>
              <TrashIcon w={5} h={5} />
            </Flex>
          </FormHelperText>
          <Box h={9} w="full">
            {errors.title?.message && inputValue.length <= 3 && (
              <FormErrorMessage
                w="full"
                color="error.500"
                display="flex"
                alignItems="center"
                pl={2}
                gap={2}
              >
                {errors.title?.message}
              </FormErrorMessage>
            )}
          </Box>
        </FormControl>

        <Dialog.Actions hideDivider>
          <Dialog.SecondaryAction onClick={props.onClose}>
            Cancel
          </Dialog.SecondaryAction>
          <Dialog.PrimaryAction
            type="submit"
            isDisabled={inputValue.length < 3}
          >
            Save
          </Dialog.PrimaryAction>
        </Dialog.Actions>
      </form>
    </Box>
  );
};
