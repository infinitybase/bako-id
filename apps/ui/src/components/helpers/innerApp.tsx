import { RouterProvider } from '@tanstack/react-router';
import { router } from '../../routes';
import { useIsConnected } from '@fuels/react';

export function InnerApp() {
  const { isConnected } = useIsConnected();

  if (isConnected === null) return;

  return <RouterProvider router={router} context={{ isConnected }} />;
}
