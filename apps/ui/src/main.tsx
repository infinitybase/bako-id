import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { defaultConnectors } from '@fuel-wallet/sdk';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { InnerApp } from './components/helpers/innerApp.tsx';
import { defaultTheme } from './theme/default.ts';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-expect-error */}
      <FuelProvider fuelConfig={{ connectors: defaultConnectors(), ui: true }}>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript initialColorMode="dark" />
          <InnerApp />
        </QueryClientProvider>
      </FuelProvider>
    </ChakraProvider>
  </React.StrictMode>
);
