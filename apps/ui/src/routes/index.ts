import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  learnMoreRoute,
  marketplaceRoute,
  moreRoute,
  myHandlesRoute,
  orderRoute,
  profileRoute,
} from './childrens.ts';

const routeTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  buyRoute,
  profileRoute,
  moreRoute,
  learnMoreRoute,
  myHandlesRoute,
  marketplaceRoute.addChildren([orderRoute]),
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
