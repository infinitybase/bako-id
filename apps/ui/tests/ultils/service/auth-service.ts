import { getByAriaLabel } from '@fuels/playwright-utils';
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
    if (!wallet) {
      const { genesisWallet } = await E2ETestUtils.setupPasskey({ page });
      wallet = genesisWallet;
    }

    const usernameInput = page.locator('#fixed_id');
    const name = `teste${Date.now()}`;
    await usernameInput.fill(name);

    await page.waitForTimeout(1000);
    await getByAriaLabel(page, 'Create account')
      .filter({ has: page.locator(':visible') })
      .click();

    const termsOfUseDialog = await page.$('[aria-label="Terms of Use"]');
    if (termsOfUseDialog) {
      await termsOfUseDialog.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
    }

    await getByAriaLabel(page, 'Accept Terms of Use').click();
    await getByAriaLabel(page, 'Begin')
      .filter({ has: page.locator(':visible') })
      .click();
    await page.waitForTimeout(1000);

    return { username: name, genesisWallet: wallet };
  }
}
