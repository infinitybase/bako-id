import { useAccount, useConnectUI, useIsConnected, useWallet } from '@fuels/react';
import {
  Button,
  Center,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { Domain, register, resolver } from '@fuel-domains/sdk';
import { ChangeEvent, useMemo, useState } from 'react';
import { Address } from 'fuels';

const checkDomain = (domain: string) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(domain);
};

const useFuelConnect = () => {
  const { isConnected, isLoading } = useIsConnected();
  const { connect } = useConnectUI();
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  return {
    wallet,
    connect,
    isLoading,
    isConnected,
    currentAccount: account
  };
};

const DomainDetailsDialog = ({ domain, ...props }: Omit<ModalProps & { domain?: { owner: string, resolver: string } }, 'children'>) => {
  const { account } = useAccount();

  const domainInfos = useMemo(() => {
    if (!domain) return {};

    const owner = Address.fromB256(domain.owner).toAddress();
    const resolver = Address.fromB256(domain.resolver).toAddress();

    return {
      owner: { address: owner, isCurrentUser: owner === account },
      resolver: { address: resolver, isCurrentUser: resolver === account }
    };
  }, [domain, account]);

  return (
    <Modal {...props} isCentered>
      <ModalCloseButton />
      <ModalOverlay />
      <ModalContent bgColor="black">
        <VStack>
          <Text>
            <strong>Owner {domainInfos.owner?.isCurrentUser && '(YOU)'}: </strong>
            {domainInfos.owner?.address}
          </Text>
          <Text>
            <strong>Resolver {domainInfos.resolver?.isCurrentUser && '(YOU)'}: </strong>
            {domainInfos.resolver?.address}
          </Text>
          <Button onClick={props.onClose}>
            Close
          </Button>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

function App() {
  const domainDetailsDialog = useDisclosure();
  const [domain, setDomain] = useState('');
  const [domainInfo, setDomainInfo] = useState<Domain | null>(null)
  const isValidDomain = useMemo(() => {
    return checkDomain(domain);
  }, [domain]);

  const { connect, isConnected, wallet } = useFuelConnect();

  const registerDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: register
  });

  const resolveDomainMutation = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver
  });

  const availableDomain = !!resolveDomainMutation.data;

  const handleChangeDomain = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target ?? {};
    const isValid = checkDomain(value);

    if (isValid || !value) {
      setDomain(value);
    }
  };

  const handleConfirmDomain = async () => {
    const isValid = checkDomain(domain);
    if (!isValid) return;

    const info = await resolveDomainMutation.mutateAsync({
      domain,
      providerURL: wallet!.provider.url
    })
    console.debug(info)
    setDomainInfo(info)
    return info;
  };

  const handleBuyDomain = async () => {
    const isValid = checkDomain(domain);
    if (!isValid || !wallet) return;

    registerDomainMutation.mutate({
      account: wallet,
      resolver: wallet.address.toB256(),
      domain: domain
    }, {
      onSuccess: async () => {
        await handleConfirmDomain();
        domainDetailsDialog.onOpen();
      },
      onError: console.log
    });
  };

  if (!isConnected) {
    return (
      <Center w="full" h="100vh" bgColor="#0b0c0c">
        <Button onClick={() => connect()}>
          Connect fuel wallet
        </Button>
      </Center>
    );
  }

  const canBuyDomain = () => {
    if (domainInfo){
      return false
    }
    if (resolveDomainMutation.isPending || !domain) {
      return true
    }
    return true
  }

  return (
    <Center w="full" h="100vh" bgColor="#1e2023">
      <DomainDetailsDialog
        domain={resolveDomainMutation.data ?? undefined}
        isOpen={domainDetailsDialog.isOpen}
        onClose={domainDetailsDialog.onClose}
      />
      <VStack spacing={5}>
        <FormControl>
          <InputGroup borderRightColor="transparent" size="lg">
            <Input
              value={domain}
              borderRight="none"
              borderColor="whiteAlpha.50"
              onChange={handleChangeDomain}
              _focus={{}}
              _hover={{}}
              _focusVisible={{}}
            />
            <InputRightAddon borderLeftColor="transparent" bgColor="transparent">
              .fuel
            </InputRightAddon>
          </InputGroup>
        </FormControl>

        {/* Buttons */}
        <VStack w="full">
          <Button
            w="full"
            isLoading={resolveDomainMutation.isPending}
            isDisabled={!isValidDomain}
            onClick={handleConfirmDomain}
          >
            Check domain
          </Button>
          {/*<Button*/}
          {/*  w="full"*/}
          {/*  hidden={!resolveDomainMutation.data}*/}
          {/*  isDisabled={resolveDomainMutation.isPending}*/}
          {/*  onClick={domainDetailsDialog.onOpen}*/}
          {/*>*/}
          {/*  View domain*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  w="full"*/}
          {/*  hidden={availableDomain || resolveDomainMutation.isPending}*/}
          {/*  isDisabled={canBuyDomain()}*/}
          {/*  onClick={handleBuyDomain}*/}
          {/*>*/}
          {/*  Buy domain*/}
          {/*</Button>*/}
        </VStack>
      </VStack>
    </Center>
  );
}

export default App;
