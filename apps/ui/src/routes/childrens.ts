import { createRoute } from '@tanstack/react-router';
import { NotConnected } from '../components/auth/notConnected.tsx';
import { rootRoute } from '../hooks/__root.ts';
import { Buy } from '../modules/buy/page.tsx';
import { Home } from '../modules/home/page.tsx';
import { Profile } from '../modules/profile/page.tsx';
import { Domains } from '../pages/domains.tsx';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Home,
  path: '/',
  // shouldReload: true,
  // beforeLoad: ({ context }) => {
  //   if (!context.isConnected) {
  //     throw redirect({
  //       to: '/auth',
  //     })
  //   }
  // }
});

export const connectRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: NotConnected,
  path: '/auth',
  // shouldReload: true,
  // loader: ({ context }) => {
  //   if (context.isConnected) {
  //     throw redirect({
  //       to: '/',
  //     })
  //   }
  // },
  // beforeLoad: ({ context }) => {
  //   if (context.isConnected) {
  //     throw redirect({
  //       to: '/',
  //     })
  //   }
  // }
});

export const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Buy,
  path: '/buy/$domain',
});

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Profile,
  path: '/profile/$domain',
});

// export const checkoutRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   component: ,
//   path: '/checkout/$domain/$transactionId',
// });

export const domainsRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Domains,
  path: '/user/domains',
});
