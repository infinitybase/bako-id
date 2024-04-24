import { useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useWallet } from '@fuels/react';
import { useMemo, useState } from 'react';
import { useCustomToast } from '../components/toast';
import { IconUtils } from '../utils/users';
import { EConnectors, useDefaultConnectors } from './fuel/useListConnectors';

export const useFuelConnect = () => {
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  const { fuel } = useFuel();
  const connectorDrawer = useDisclosure();
  const { connectors } = useDefaultConnectors();
  const [isConnecting, setIsConnecting] = useState(false);

  const { errorToast } = useCustomToast();

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
      setIsConnecting(true);
      await fuel.connect();
      await fuel.currentNetwork();
      await fuel.currentAccount();

      setIsConnecting(false);
    } catch (e) {
      errorToast({
        title: 'Error connecting to wallet',
        description: e as string,
      });
    }
  };

  const generateIcon = (account: string) => {
    const AVATAR_STORAGE_KEY = '@BAKO-ID/AVATAR';
    const userStorageKey = `${AVATAR_STORAGE_KEY}/${account}`;

    if (localStorage.getItem(userStorageKey)) return;

    localStorage.setItem(`${AVATAR_STORAGE_KEY}/${account}`, IconUtils.user());
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    if (account) {
      generateIcon(account);
    }
  }, [account]);

  return {
    wallet,
    currentAccount: account,
    connectors: {
      isConnecting,
      item: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
    },
  };
};
