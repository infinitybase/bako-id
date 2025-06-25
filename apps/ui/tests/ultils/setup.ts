import {
  downloadFuel,
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Mnemonic, Provider, Wallet } from 'fuels';

export class E2ETestUtils {
  static FUEL_WALLET_VERSION = '0.46.1';

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

    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

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

    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return { genesisWallet };
  }

  static async signMessageFuelWallet(config: {
    fuelWalletTestHelper: FuelWalletTestHelper;
    page: Page;
  }) {
    const { fuelWalletTestHelper, page } = config;
    await page.waitForTimeout(2000);
    const popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    await getByAriaLabel(popupPage, 'Sign').click();
  }
}
