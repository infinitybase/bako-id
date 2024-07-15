import { useConnectors } from '@fuels/react';
import { FuelIcon, FueletIcon } from '../../components/icons';

export enum EConnectors {
  FUEL = 'Fuel Wallet',
  FUEL_DEV = 'Fuel Wallet Development',
  FULLET = 'Fuelet Wallet',
  // WEB_AUTHN = 'Login With Passkey',
}

const DEFAULT_CONNECTORS = [
  // {
  //   name: EConnectors.WEB_AUTHN,
  //   icon: PasskeyIcon,
  //   isBeta: true,
  // },
  {
    name: EConnectors.FUEL,
    icon: FuelIcon,
    isBeta: false,
  },
  {
    name: EConnectors.FUEL_DEV,
    icon: FuelIcon,
    isBeta: false,
  },
  {
    name: EConnectors.FULLET,
    icon: FueletIcon,
    isBeta: false,
  },
];

const useDefaultConnectors = () => {
  const { connectors, ...query } = useConnectors();

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = connectors?.find((c) => c.name === connector.name);
    // const hasWebAuthn = !!window.navigator.credentials;
    // const isWebAuthn = connector.name === EConnectors.WEB_AUTHN;
    return {
      ...connector,
      imageUrl: undefined,
      isEnabled: !!fuelConnector && fuelConnector.installed,
    };
  });

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useDefaultConnectors };
