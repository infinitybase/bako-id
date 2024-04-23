import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import * as test from '@farcaster/auth-kit';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { defaultConnectors } from '@fuel-wallet/sdk';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './components/helpers/innerApp.tsx';
import { defaultTheme } from './theme/default.ts';

console.log(test);
const queryClient = new QueryClient();

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-expect-error */}
      <FuelProvider fuelConfig={{ connectors: defaultConnectors(), ui: true }}>
        <QueryClientProvider client={queryClient}>
          <AuthKitProvider config={config}>
            <ColorModeScript initialColorMode="dark" />
            <InnerApp />
          </AuthKitProvider>
        </QueryClientProvider>
      </FuelProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
