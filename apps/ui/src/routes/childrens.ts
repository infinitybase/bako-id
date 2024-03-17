import { createRoute } from '@tanstack/react-router';
import { Home } from '../pages/home.tsx';
import { rootRoute } from '../hooks/__root.ts';
import { NotConnected } from '../components/auth/notConnected.tsx';
import { Domain } from '../pages/domain.tsx';
import { Buy } from '../pages/buy.tsx';
import { Purchased } from '../pages/purchased.tsx';
import { Domains } from '../pages/domains.tsx';
import { User } from '../pages/user.tsx';

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
})

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
})

export const domainRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Domain,
  path: '/$domain'
})

export const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Buy,
  path: '/buy/$domain'
})

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Purchased,
  path: '/checkout/$domain'
})

export const domainsRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Domains,
  path: '/user/domains'
})

export const profilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: User,
  path: '/user/$user'
})
