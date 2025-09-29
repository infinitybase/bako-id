import fs from 'fs';
import path from 'path';
import { downloadFuel } from '@fuels/playwright-utils';

const downloadFuelExtension = async (): Promise<string> => {
  const FUEL_WALLET_VERSION = '0.55.1';

  const absCacheDir = path.resolve(
    `./.cache/fuel-wallet/v${FUEL_WALLET_VERSION}`,
  );
  const relCacheDir = path.relative(process.cwd(), absCacheDir);

  if (!fs.existsSync(absCacheDir)) {
    fs.mkdirSync(absCacheDir, { recursive: true });
  }

  const markerFile = path.join(absCacheDir, 'READY');

  if (fs.existsSync(markerFile)) {
    console.log(
      `Fuel Wallet v${FUEL_WALLET_VERSION} already cached at ${relCacheDir}.`,
    );
  } else {
    console.log(`Downloading Fuel Wallet v${FUEL_WALLET_VERSION}...`);
    const extensionPath = await downloadFuel(FUEL_WALLET_VERSION);

    fs.cpSync(extensionPath, absCacheDir, { recursive: true });
    fs.writeFileSync(markerFile, '');

    console.log(`Fuel Wallet cached at: ${relCacheDir}`);
  }

  return absCacheDir;
};

const globalSetup = async () => {
  const isLocal = process.env.PREVIEW_MODE !== 'true';
  process.env.TEST_NETWORK = isLocal ? process.env.NETWORK_LOCAL : process.env.NETWORK_PREVIEW;

  process.env.FUEL_EXTENSION_PATH = await downloadFuelExtension();
};

export default globalSetup;
