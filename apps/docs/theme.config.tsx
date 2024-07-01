import Image from 'next/image';
import type { DocsThemeConfig } from 'nextra-theme-docs';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import {
  default as favicon,
  default as logo,
} from './assets/BAKO_CONNECTOR_ICON.svg';

const config: DocsThemeConfig = {
  primaryHue: {
    dark: 50,
    light: 50,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Bako ID (SDK)" />
      <meta property="og:description" content="Documentation of Bako ID SDK" />
      <link rel="icon" href={favicon.src} />
    </>
  ),
  logo: <Image src={logo} width={40} alt="Bako ID logo" />,
  project: {
    link: 'https://github.com/infinitybase/bako-id',
  },
  chat: {
    link: 'https://discord.gg/gSXeZkF2',
  },
  footer: {
    text: 'Bako ID',
  },
  useNextSeoProps() {
    return {
      titleTemplate: ' %s | Bako ID',
    };
  },
  feedback: {
    content: <></>,
  },
  editLink: {
    component: () => <></>,
  },
};

export default config;
