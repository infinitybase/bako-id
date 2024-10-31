import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import {
  BakoSafeConnector,
  FuelWalletConnector,
  FueletWalletConnector,
} from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CHAIN_IDS } from 'fuels';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './components';
import { defaultTheme } from './theme/default.ts';

const queryClient = new QueryClient();

const NETWORKS = [
  {
    chainId: CHAIN_IDS.fuel.testnet,
    url: 'https://testnet.fuel.network/v1/graphql',
  },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <FuelProvider
          theme="dark"
          networks={NETWORKS}
          fuelConfig={{
            connectors: [
              new BakoSafeConnector(),
              new FuelWalletConnector(),
              new FueletWalletConnector(),
            ],
          }}
        >
          <ColorModeScript initialColorMode="dark" />
          <InnerApp />
        </FuelProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
