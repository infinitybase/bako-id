import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';

type Config = {
  favicon: string;
  title: string;
};
type ConfigType = Record<
  string,
  {
    favicon: string;
    title: string;
  }
>;

const CONFIG: ConfigType = {
  garage: {
    favicon: '/garage-favicon.svg',
    title: 'Garage',
  },
  bako: {
    favicon: '/logo.svg',
    title: 'Bako Identity',
  },
};

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { hostname } = url;

  let config: Config;
  if (hostname.includes('garage')) config = CONFIG.garage;
  else config = CONFIG.bako;

  const indexPath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');
  const htmlFinal = html
    .replace('{LOGO}', config.favicon)
    .replace('{TITLE}', config.title);

  return new Response(htmlFinal, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
