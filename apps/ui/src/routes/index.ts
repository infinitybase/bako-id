import {
  createRouter,
} from '@tanstack/react-router';
import { rootRoute } from '../hooks/__root.ts';
import {
  buyRoute,
  checkoutRoute,
  connectRoute,
  domainRoute,
  domainsRoute,
  homeRoute,
  profilesRoute
} from './childrens.ts';

const routeTree = rootRoute.addChildren([homeRoute, connectRoute, domainRoute, buyRoute, checkoutRoute, domainsRoute, profilesRoute])

export const router = createRouter({ routeTree, context: {
  isConnected: null
}})
