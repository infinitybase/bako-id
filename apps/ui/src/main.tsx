import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { FuelProvider } from '@fuels/react';
import { defaultConnectors } from '@fuel-wallet/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultTheme } from './theme/default.ts';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <FuelProvider fuelConfig={{ connectors: defaultConnectors(), ui: true }}>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript initialColorMode="dark" />
          <App />
        </QueryClientProvider>
      </FuelProvider>
    </ChakraProvider>
  </React.StrictMode>
);
