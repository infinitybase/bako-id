import {
  downloadFuel,
  FuelWalletTestHelper,
  getButtonByText,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Mnemonic, Provider, Wallet } from 'fuels';

export class E2ETestUtils {
  static FUEL_WALLET_VERSION = '0.55.1';

  static async downloadFuelExtension(config: { test: typeof test }) {
    const path = await downloadFuel(E2ETestUtils.FUEL_WALLET_VERSION);
    config.test.use({ pathToExtension: path });
  }

  static async setupFuelWallet(config: {
    page: Page;
    context: BrowserContext;
    extensionId: string;
  }) {
    const { context, extensionId } = config;
    const provider = new Provider('http://testnet.fuel.network/v1/graphql');
    const genesisWallet = Wallet.fromPrivateKey(
      '0x5ac4a3075cfeb0a1238efc082978aa6a7a2efe11e6f2ce2b564d708807fab6ad',
      provider,
    );

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

    const closeButton = walletPage.getByRole('button', {
      name: 'Close dialog',
    });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }

    await fuelWalletTestHelper.addAccount();
    await fuelWalletTestHelper.switchAccount('Account 1');

    await config.page.bringToFront();

    return { fuelWalletTestHelper, genesisWallet };
  }

  static async setupPasskey(config: { page: Page }) {
    const provider = new Provider('http://testnet.fuel.network/v1/graphql');
    const genesisWallet = Wallet.fromPrivateKey(
      '0x5ac4a3075cfeb0a1238efc082978aa6a7a2efe11e6f2ce2b564d708807fab6ad',
      provider,
    );

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
