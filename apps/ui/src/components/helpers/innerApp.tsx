import { useIsConnected } from '@fuels/react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../../routes';

export function InnerApp() {
  const { isConnected } = useIsConnected();

  if (isConnected === null) return;

  return <RouterProvider router={router} context={{ isConnected }} />;
}
