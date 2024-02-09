import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider, ColorModeScript, ThemeConfig } from '@chakra-ui/react';
import { FuelProvider } from '@fuel-wallet/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { extendTheme } from '@chakra-ui/react'

const queryClient = new QueryClient();

const config: ThemeConfig = {
  initialColorMode: 'dark',
}

const theme = extendTheme({ config })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <FuelProvider>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript initialColorMode="dark" />
          <App />
        </QueryClientProvider>
      </FuelProvider>
    </ChakraProvider>
  </React.StrictMode>
);
