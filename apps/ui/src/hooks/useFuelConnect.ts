import { useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useWallet } from '@fuels/react';
import { useEffect, useMemo, useState } from 'react';
import { useCustomToast } from '../components';
import { IconUtils } from '../utils/users';
import { EConnectors, useDefaultConnectors } from './fuel/useListConnectors';

export const useFuelConnect = () => {
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  const { fuel } = useFuel();
  const connectorDrawer = useDisclosure();
  const { connectors } = useDefaultConnectors();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectError, setIsConnectError] = useState(false);

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
      setIsConnectError(true);
      errorToast({
        title: 'Error while connecting wallet',
        description: (e as Error).message,
      });
      return;
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

  useEffect(() => {
    if (isConnectError) {
      setTimeout(() => {
        setIsConnectError(false);
        setIsConnecting(false);
      }, 500);
    }
  }, [isConnectError]);

  return {
    wallet,
    isConnectError,
    currentAccount: account,
    connectors: {
      isConnecting,
      isConnectError,
      item: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
    },
  };
};
