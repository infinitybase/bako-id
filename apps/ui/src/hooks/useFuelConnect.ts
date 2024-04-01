import { Toast, useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useWallet } from '@fuels/react';
import { EConnectors, useDefaultConnectors } from './fuel/useListConnectors';

export const useFuelConnect = () => {
  const { account } = useAccount();
  const { wallet } = useWallet(account);
  const { fuel } = useFuel();
  const connectorDrawer = useDisclosure();
  const { connectors } = useDefaultConnectors();

  const selectConnector = async (connector: string) => {
    await fuel.selectConnector(connector);
    connectorDrawer.onClose();
    const isbyWallet =
      connector === EConnectors.FUEL || connector === EConnectors.FULLET;
    if (isbyWallet) {
      return connectByWallet();
    }
  };

  const connectByWallet = async () => {
    try {
      await fuel.connect();
      await fuel.currentNetwork();
      await fuel.currentAccount();
    } catch (e) {
      Toast({
        title: 'Error connecting to wallet',
        description: e as string,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return {
    wallet,
    currentAccount: account,
    connectors: {
      item: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
    },
  };
};
