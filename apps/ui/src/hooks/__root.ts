import { createRootRouteWithContext } from '@tanstack/react-router';
import { Layout } from '../components/layout';

interface MyRouterContext {
  isConnected: boolean | null;
}

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: Layout,
});
