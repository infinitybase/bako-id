import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  learnMoreRoute,
  moreRoute,
  myHandlesRoute,
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
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
