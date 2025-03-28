import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider, type NetworkConfig } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { coinbaseWallet, walletConnect } from '@wagmi/connectors';
import { http, createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { CHAIN_IDS, Provider } from 'fuels';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './components';
import { defaultTheme } from './theme/default.ts';

const queryClient = new QueryClient();

const WC_PROJECT_ID = import.meta.env.VITE_APP_WC_PROJECT_ID;
const METADATA = {
  name: 'Bako Identity',
  description: '',
  url: location.href,
  icons: ['https://app.bako.id/bakoID-logo.svg'],
};
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  syncConnectedChain: true,
  connectors: [
    injected({ shimDisconnect: false }),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: METADATA,
      showQrModal: false,
    }),
    coinbaseWallet({
      appName: METADATA.name,
      appLogoUrl: METADATA.icons[0],
      darkMode: true,
      reloadOnDisconnect: true,
    }),
  ],
});

export const BASE_NETWORK_CONFIGS: NetworkConfig[] = [
  {
    chainId: CHAIN_IDS.fuel.testnet,
    url: 'https://testnet.fuel.network/v1/graphql',
    bridgeURL:
      'https://app-testnet.fuel.network/bridge?from=eth&to=fuel&auto_close=true',
  },
  {
    chainId: CHAIN_IDS.fuel.devnet,
    url: 'https://devnet.fuel.network/v1/graphql',
    bridgeURL:
      'https://app-devnet.fuel.network/bridge?from=eth&to=fuel&auto_close=true',
  },
  {
    chainId: CHAIN_IDS.fuel.mainnet,
    url: 'https://mainnet.fuel.network/v1/graphql',
    bridgeURL:
      'https://app.fuel.network/bridge?from=eth&to=fuel&auto_close=true',
  },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <FuelProvider
          theme="dark"
          uiConfig={{ suggestBridge: false }}
          networks={BASE_NETWORK_CONFIGS}
          fuelConfig={{
            connectors: defaultConnectors({
              ethWagmiConfig: wagmiConfig,
              chainId: CHAIN_IDS.fuel.mainnet,
              fuelProvider: new Provider(import.meta.env.VITE_PROVIDER_URL!),
            }),
          }}
        >
          <ColorModeScript initialColorMode="dark" />
          <InnerApp />
        </FuelProvider>
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
