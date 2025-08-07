import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useProvider } from '@fuels/react';
import { Address, isB256 } from 'fuels';
import { Suspense, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { AddressUtils, CHECKSUM_MESSAGE } from '../../utils/address';
import { Alert } from '../alert';
import { ProgressButton } from '../buttons/progressButton.tsx';
import { Dialog } from '../dialog';
import { BakoTooltip } from '../helpers';
import { InfoIcon } from '../icons/infoIcon';
import { TextValue } from '../inputs';

interface IEditResolverModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolver: string) => Promise<void>;
  domain: string;
  resolver: string;
  progress: number;
  isLoading?: boolean;
}

interface IDetailStepModal {
  isOpen: boolean;
  onClose: () => void;
  onReturn: () => void;
  onConfirm: () => void;
  domain: string;
  resolver: string;
  newResolver: string;
  progress: number;
  isLoading?: boolean;
}

interface IEditResolverStepModal {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  newResolver: string;
  setNewResolver: (value: string) => void;
}

type EditResolverValidation = {
  resolver: string;
};

const DetailStepModal = ({
  isOpen,
  domain,
  resolver,
  newResolver,
  onClose,
  onConfirm,
  onReturn,
  progress,
  isLoading,
}: IDetailStepModal) => (
  <Dialog.Modal
    size="lg"
    motionPreset="slideInBottom"
    modalTitle="Transaction details"
    modalSubtitle="All changes in your Handle generates a new transaction. Confirm the details before you continue."
    isOpen={isOpen}
    onClose={onClose}
  >
    <Suspense fallback>
      <Dialog.Body alignItems="flex-start">
        <VStack spacing={2}>
          <TextValue leftAction={'action'} content="Edit Resolver" />
          <TextValue leftAction={'handle'} content={domain} />
        </VStack>
        <Text fontSize="sm" mt={6} mb={2}>
          Updates
        </Text>
        <Divider mb={4} />
        <VStack spacing={2}>
          <TextValue
            breakRow
            textAlign="right"
            leftAction={'old'}
            content={resolver}
          />
          <TextValue
            breakRow
            textAlign="right"
            leftAction={'new'}
            content={newResolver}
          />
        </VStack>
      </Dialog.Body>
    </Suspense>

    <Dialog.Actions hideDivider mt={8} gap={2}>
      <Dialog.SecondaryAction onClick={onReturn}>Cancel</Dialog.SecondaryAction>
      <ProgressButton
        w="full"
        background="button.500"
        progressColor="white"
        isDisabled={isLoading}
        progress={progress}
        onClick={onConfirm}
      >
        Confirm
      </ProgressButton>
    </Dialog.Actions>
  </Dialog.Modal>
);

const EditResolverStepModal = ({
  isOpen,
  onClose,
  onOpen,
  newResolver,
  setNewResolver,
}: IEditResolverStepModal) => {
  const {
    control,
    formState: { errors, isValid },
    setError,
  } = useForm<EditResolverValidation>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      resolver: '',
    },
  });

  const [isValidResolver, setIsValidResolver] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | undefined>();
  const { provider } = useProvider();

  const resolver = useWatch({
    control,
    name: 'resolver',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isB256(resolver) && provider) {
      provider
        .getAddressType(resolver)
        .then((type) => {
          const validAccountType = ['Account', 'Contract'].includes(type);
          setIsValidResolver(validAccountType);
          if (!validAccountType) {
            setError('resolver', {
              type: 'manual',
              message: 'The resolver address must be an Account or Contract.',
            });
          }
        })
        .catch(() => {
          setIsValidResolver(false);
        });

      const checksumValid = Address.isChecksumValid(resolver);
      setWarningMessage(checksumValid ? undefined : CHECKSUM_MESSAGE);

      return;
    }

    setWarningMessage(undefined);
    setIsValidResolver(false);
  }, [resolver, provider]);

  return (
    <Dialog.Modal
      size="lg"
      motionPreset="slideInBottom"
      modalTitle="Resolver"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Suspense>
        <Dialog.Body>
          <VStack alignItems="flex-start" justifyItems="center" spacing={2}>
            <FormControl
              fontSize="medium"
              isInvalid={!!errors?.resolver && newResolver.length >= 0}
            >
              <Controller
                name="resolver"
                control={control}
                defaultValue=""
                rules={{
                  required: { value: true, message: 'You must type something' },
                  minLength: {
                    value: 63,
                    message: 'You must type a valid resolver address.',
                  },
                  validate: (value) => {
                    const valid = AddressUtils.isValid(value);
                    return (
                      valid || 'Invalid resolver address, please try again.'
                    );
                  },
                }}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setNewResolver(e.target.value);
                      }}
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
                      sx={{
                        _placeholder: { color: 'grey.200' },
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    />

                    <FormLabel
                      isTruncated
                      fontWeight="normal"
                      maxW="80%"
                      fontSize="sm"
                    >
                      Address
                    </FormLabel>
                  </>
                )}
              />
              <Box h={5} w="full">
                {errors.resolver?.message && (
                  <FormErrorMessage
                    w="full"
                    color="error.500"
                    display="flex"
                    alignItems="center"
                    pl={2}
                    gap={2}
                  >
                    {errors.resolver.type === 'minLength' ? (
                      <BakoTooltip
                        w="full"
                        label={
                          <UnorderedList>
                            <ListItem>
                              Resolver must be at least 63 characters.
                            </ListItem>
                            <ListItem>
                              It is considered a valid resolver address if it
                              starts with: 0x or fuel
                            </ListItem>
                          </UnorderedList>
                        }
                      >
                        <InfoIcon w={4} h={4} color="error.500" mb={0.5} />
                      </BakoTooltip>
                    ) : (
                      <></>
                    )}
                    {errors.resolver?.message}
                  </FormErrorMessage>
                )}
              </Box>
            </FormControl>
          </VStack>
          {warningMessage && isValidResolver && !errors.resolver?.message && (
            <Alert.Warning message={warningMessage} />
          )}
        </Dialog.Body>
      </Suspense>

      <Dialog.Actions hideDivider mt={8} gap={2}>
        <Dialog.SecondaryAction onClick={onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          isDisabled={
            !isValid || !isValidResolver || (!!warningMessage && !isValid)
          }
          onClick={onOpen}
        >
          Save
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export const EditResolverModal = ({
  isOpen,
  onClose,
  onConfirm,
  domain,
  resolver,
  progress,
  isLoading,
}: IEditResolverModal) => {
  const {
    isOpen: isOpenDetailStep,
    onClose: onCloseDetailStep,
    onOpen: onOpenDetailStep,
  } = useDisclosure();
  const [newResolver, setNewResolver] = useState<string>('');

  const closeAll = () => {
    onClose();
    onCloseDetailStep();
  };

  return isOpenDetailStep ? (
    <DetailStepModal
      isOpen={isOpenDetailStep}
      onClose={closeAll}
      onReturn={onCloseDetailStep}
      onConfirm={async () => {
        onConfirm(newResolver).then(closeAll).catch(console.log);
      }}
      isLoading={isLoading}
      domain={domain}
      resolver={resolver}
      newResolver={newResolver}
      progress={progress}
    />
  ) : (
    <EditResolverStepModal
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpenDetailStep}
      newResolver={newResolver}
      setNewResolver={setNewResolver}
    />
  );
};
