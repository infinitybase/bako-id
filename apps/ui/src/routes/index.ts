import { createRouter } from '@tanstack/react-router';
import { rootRoute } from '../hooks/__root.ts';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  moreRoute,
  profileRoute,
} from './childrens.ts';

const routeTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  buyRoute,
  profileRoute,
  moreRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
