import {
  FuelWalletTestHelper,
  getButtonByText,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Mnemonic, Provider, Wallet } from 'fuels';

const buildProvider = () => {
  const provider = new Provider(process.env.TEST_NETWORK!);
  const genesisWallet = Wallet.fromPrivateKey(
    process.env.TEST_WALLET_PRIVATE_KEY!,
    provider,
  );

  return { provider, genesisWallet };
};

export class E2ETestUtils {
  static async downloadFuelExtension(config: { test: typeof test }) {
    config.test.use({ pathToExtension: process.env.FUEL_EXTENSION_PATH });
  }

  static async setupFuelWallet(config: {
    page: Page;
    context: BrowserContext;
    extensionId: string;
  }) {
    const { context, extensionId } = config;
    const { provider, genesisWallet } = buildProvider();

    const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup({
      context,
      fuelExtensionId: extensionId,
      fuelProvider: {
        url: provider.url,
        chainId: await provider.getChainId(),
      },
      chainName: (await provider.getChain()).name,
      mnemonic: Mnemonic.generate(),
    });

    const walletPage = fuelWalletTestHelper.getWalletPage();

    const closeBtn = walletPage.getByRole('button', { name: 'Close dialog' });

    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    await fuelWalletTestHelper.addAccount();
    await fuelWalletTestHelper.switchAccount('Account 1');

    await config.page.bringToFront();

    return { fuelWalletTestHelper, genesisWallet };
  }

  static async setupPasskey(config: { page: Page }) {
    const { genesisWallet } = buildProvider();

    const client = await config.page.context().newCDPSession(config.page);
    await client.send('WebAuthn.enable');
    await client.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });

    return { genesisWallet };
  }

  static async signMessageFuelWallet(config: {
    fuelWalletTestHelper: FuelWalletTestHelper;
    page: Page;
  }) {
    const { fuelWalletTestHelper, page } = config;
    await page.waitForTimeout(2000);
    const popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    await getButtonByText(popupPage, 'Submit').click();
    await popupPage.waitForEvent('close');
  }
}
