import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { coinbaseWallet, walletConnect } from '@wagmi/connectors';
import { http, createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import * as Sentry from '@sentry/react';

import { CHAIN_IDS, Provider } from 'fuels';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './components';
import { defaultTheme } from './theme/default.ts';

const { VITE_SENTRY_DSN, VITE_NODE_ENV } = import.meta.env;

if (VITE_NODE_ENV === 'production' && VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', 'https://api.bako.id'],
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const queryClient = new QueryClient();

const WC_PROJECT_ID = import.meta.env.VITE_APP_WC_PROJECT_ID;
const METADATA = {
  name: 'Bako Identity',
  description: '',
  url: location.href,
  icons: ['https://app.bako.id/bakoID-logo.svg'],
};
const wagmiConfig = createConfig({
  // @ts-ignore
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

const NETWORKS = [
  {
    chainId: CHAIN_IDS.fuel.testnet,
    url: 'https://testnet.fuel.network/v1/graphql',
  },
  {
    chainId: CHAIN_IDS.fuel.mainnet,
    url: 'https://mainnet.fuel.network/v1/graphql',
  },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <FuelProvider
          theme="dark"
          networks={NETWORKS}
          uiConfig={{ suggestBridge: false }}
          fuelConfig={{
            connectors: defaultConnectors({
              ethWagmiConfig: wagmiConfig,
              chainId: CHAIN_IDS.fuel.mainnet,
              fuelProvider: Provider.create(import.meta.env.VITE_PROVIDER_URL!),
            }),
          }}
        >
          <ColorModeScript initialColorMode="dark" />
          <InnerApp />
        </FuelProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
