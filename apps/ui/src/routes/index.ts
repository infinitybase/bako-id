import { createRouter } from '@tanstack/react-router';
import { rootRoute } from '../hooks/__root.ts';
import {
  buyRoute,
  checkoutRoute,
  connectRoute,
  domainRoute,
  domainsRoute,
  homeRoute,
} from './childrens.ts';

const routeTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  domainRoute,
  buyRoute,
  checkoutRoute,
  domainsRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
