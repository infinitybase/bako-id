import { FuelWalletTestHelper, getByAriaLabel } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

import { E2ETestUtils } from '../setup';

interface LoginAuthTestResponse {
  username: string;
  genesisWallet: WalletUnlocked;
}

export class AuthTestService {
  static async loginAuth(
    page: Page,
    wallet: WalletUnlocked | null = null,
  ): Promise<LoginAuthTestResponse> {
    await page.getByRole('button', { name: 'Connect Wallet' }).click();
    await page.getByLabel('Connect to Bako Safe').click();
    const popup = await page.waitForEvent('popup');

    if (!wallet) {
      const { genesisWallet } = await E2ETestUtils.setupPasskey({
        page: popup,
      });
      wallet = genesisWallet;
    }

    const usernameInput = popup.locator('#fixed_id');
    const name = `teste${Date.now()}`;
    await usernameInput.fill(name);

    await popup.waitForTimeout(1000);
    await getByAriaLabel(popup, 'Create account')
      .filter({ has: popup.locator(':visible') })
      .click();

    const termsOfUseDialog = await popup.$('[aria-label="Terms of Use"]');
    if (termsOfUseDialog) {
      await termsOfUseDialog.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
    }

    await getByAriaLabel(popup, 'Accept Terms of Use').click();
    await getByAriaLabel(popup, 'Begin')
      .filter({ has: popup.locator(':visible') })
      .click();

    await popup.waitForEvent('close');

    return { username: name, genesisWallet: wallet };
  }

  static async loginWalletConnection(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    account: string = 'Account 1',
  ) {
    await page.getByRole('button', { name: 'Connect Wallet' }).click();
    await page.getByLabel('Connect to Fuel Wallet').click();
    await fuelWalletTestHelper.walletConnect([account]);
  }
}
