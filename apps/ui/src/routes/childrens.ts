import { createRoute, redirect } from '@tanstack/react-router';
import { Home } from '../pages/home.tsx';
import { rootRoute } from '../hooks/__root.ts';
import { NotConnected } from '../components/auth/notConnected.tsx';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Home,
  path: '/',
  shouldReload: true,
  beforeLoad: ({ context }) => {
    if (!context.isConnected) {
      throw redirect({
        to: '/auth',
      })
    }
  }
})

export const connectRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: NotConnected,
  path: '/auth',
  shouldReload: true,
  loader: ({ context }) => {
    if (context.isConnected) {
      throw redirect({
        to: '/',
      })
    }
  },
  beforeLoad: ({ context }) => {
    if (context.isConnected) {
      throw redirect({
        to: '/',
      })
    }
  }
})
