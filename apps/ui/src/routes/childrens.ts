import { createRoute, redirect } from '@tanstack/react-router';
import { Home } from '../pages/home.tsx';
import { Connect } from '../components/helpers';
import { rootRoute } from '../hooks/__root.ts';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Home,
  path: '/',
  beforeLoad: ({ context }) => {
    console.debug(context)
    if (!context.isConnected) {
      throw redirect({
        to: '/connect',
      })
    }
  }
})

export const connectRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Connect,
  path: '/connect',
  loader: ({ context }) => {
    if (context.isConnected) {
      throw redirect({
        to: '/',
      })
    }
  },
  beforeLoad: ({ context }) => {
    console.debug(context)
    if (context.isConnected) {
      throw redirect({
        to: '/',
      })
    }
  }
})
