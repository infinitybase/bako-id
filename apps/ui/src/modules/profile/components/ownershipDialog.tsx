import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  type ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import { Controller, useForm } from 'react-hook-form';
import { BlueWarningIcon, Dialog, useCustomToast } from '../../../components';
import { ProgressButton } from '../../../components/buttons/progressButton.tsx';
import { useRegistryContract } from '../../../hooks/sdk';
import { useMutationProgress } from '../../../hooks/useMutationProgress.ts';
import { REMOVED_OWNER_NFT } from '@/hooks/useCollections.ts';
import { setLocalStorage } from '@/utils/localStorage.ts';

export interface OwnershipDialogProps extends Omit<ModalProps, 'children'> {
  doamin: string;
  domainName: string;
}

export const OwnershipDialog = (props: OwnershipDialogProps) => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      address: '',
    },
  });
  const { successToast, errorToast } = useCustomToast();
  const registryContract = useRegistryContract();

  const mutation = useMutation({
    mutationKey: ['changeOwner'],
    mutationFn: async (address: string) => {
      if (!registryContract) return;
      return registryContract.changeOwner({
        domain: props.doamin,
        address,
      });
    },
    onSuccess: () => {
      form.reset({ address: '' });
      successToast({
        title: 'Transaction success',
        description: 'The owner of the handle has been updated',
      });

      const name = props.domainName?.startsWith('@')
        ? props.domainName
        : `@${props.domainName}`;

      setLocalStorage(REMOVED_OWNER_NFT, name);

      setTimeout(() => {
        props.onClose();
      }, 700);
    },
    onError: () => {
      errorToast({
        title: 'Transaction error',
        description: 'An error occurred while updating the owner',
      });
    },
  });

  const mutationProgress = useMutationProgress(mutation);

  return (
    <Dialog.Modal
      motionPreset="slideInBottom"
      modalTitle="Change Ownership"
      modalSubtitle="Set the adress to be the new owner of this handle"
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'lg' }}
      titleFontSize="14px"
      subtitleFontSize="xs"
    >
      <Dialog.Body>
        <Controller
          name="address"
          rules={{
            required: {
              value: true,
              message: `The Address can't be empty`,
            },
            validate: (value) => isB256(value) || 'Invalid b256 address',
          }}
          control={form.control}
          render={({ field, fieldState }) => (
            <FormControl
              isInvalid={fieldState.invalid}
              display="flex"
              flexDirection="column"
            >
              <InputGroup
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Box w="full">
                  <Input
                    {...field}
                    isInvalid={fieldState.invalid}
                    variant="autocomplete"
                    color="white"
                    fontWeight="normal"
                    w="full"
                    fontSize={['xs', 'md']}
                    placeholder=" "
                    autoComplete="off"
                    textColor="text.700"
                    background="input.900"
                    type="text"
                    errorBorderColor="error.500"
                    flex={1}
                    sx={{ _placeholder: { color: 'grey.200' } }}
                  />

                  <FormLabel
                    isTruncated
                    fontWeight="normal"
                    maxW="80%"
                    fontSize="sm"
                  >
                    Address
                  </FormLabel>
                </Box>
              </InputGroup>
              <Box h={9} w="full">
                {!!fieldState.error && (
                  <FormErrorMessage
                    w="full"
                    color="error.500"
                    display="flex"
                    alignItems="center"
                    pl={2}
                    gap={2}
                  >
                    {fieldState.error?.message}
                  </FormErrorMessage>
                )}
              </Box>
            </FormControl>
          )}
        />
        <VStack
          alignItems="start"
          justifyContent="center"
          bg="rgba(0, 127, 219, 0.15)"
          borderRadius="8px"
          p="12px 8px"
          border="1px solid #007FDB4D"
        >
          <Flex gap="6px">
            <Icon as={BlueWarningIcon} />
            <Heading color="info.500" fontWeight={600} fontSize="14px">
              Warning!
            </Heading>
          </Flex>
          <Text color="info.200" fontSize="xs" lineHeight="14.52px" ml={6}>
            Changing the ownership address will permanently disable the ability
            to edit this handle. Please proceed with caution.
          </Text>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions hideDivider gap={2} mt={6}>
        <Dialog.SecondaryAction
          isDisabled={mutation.isPending}
          onClick={() => {
            form.reset({ address: '' });
            props.onClose();
          }}
        >
          Cancel
        </Dialog.SecondaryAction>
        <ProgressButton
          w="full"
          background="button.500"
          progressColor="white"
          progress={mutationProgress}
          onClick={form.handleSubmit((data) => {
            mutation.mutate(data.address);
          })}
          isDisabled={mutation.isPending || !form.formState.isValid}
        >
          Change Ownership
        </ProgressButton>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
