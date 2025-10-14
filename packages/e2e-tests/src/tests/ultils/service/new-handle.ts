import { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { Page, expect } from '@playwright/test';
import { getAddress, transfer } from '../helpers';
import { E2ETestUtils } from '../setup';

export class NewHandleService {
  static async getValueNewHandle(page: Page) {
    await page.locator('text=Estimated total').waitFor({ state: 'visible' });
    const estimatedTotal = await page.evaluate(() => {
      return (
        document
          .querySelector(
            'div.chakra-stack.css-10t90fk p.chakra-text.css-io0ltg:nth-of-type(2)',
          )
          ?.textContent?.trim() ?? ''
      );
    });
    const rawValue = parseFloat(estimatedTotal.replace('ETH', '').trim());
    const value = rawValue + 0.0000002;

    return value;
  }

  static async getValueEditProfile(
    fuelWalletTestHelper: FuelWalletTestHelper,
    page: Page,
  ) {
    let popupPage: Page;
    try {
      popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    } catch {
      await page.getByRole('button', { name: 'Save changes' }).click();
      await page.getByRole('button', { name: 'Confirm' }).click();

      popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    }

    const estimatedTotal = parseFloat(
      (await popupPage.locator('p[aria-label="fee value:Regular"]').innerText())
        .replace('ETH', '')
        .trim(),
    );

    const value = estimatedTotal + 0.0000002;

    return value;
  }

  static async createNewHandle(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    genesisWallet: any,
    handleName?: string,
  ): Promise<{ handle: string; value: number }> {
    const newHandle = handleName || `automation${Date.now()}`;
    console.log('Creating new handle: ', newHandle);

    await page
      .getByRole('textbox', { name: 'Search for an available Handle' })
      .fill(newHandle);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText(newHandle)).toBeVisible();
    await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

    const value = await this.getValueNewHandle(page);

    const { address1 } = await getAddress(fuelWalletTestHelper);

    try {
      await page.getByRole('button', { name: 'Connect Wallet' }).click();
      await page.getByLabel('Connect to Fuel Wallet').click();
    } catch {
      await page.getByRole('button', { name: 'Connect Wallet' }).nth(1).click();
      await page.getByLabel('Connect to Fuel Wallet').click();
    }

    await transfer(genesisWallet, value, address1);
    await page.waitForTimeout(500);

    await fuelWalletTestHelper.walletConnect(['Account 1']);

    await page.getByRole('button', { name: 'Confirm Transaction' }).click();

    await page
      .getByLabel('Bako ID Terms Of Use Agreement')
      .locator('div')
      .filter({ hasText: '1. The Bako IDThe “Bako ID”' })
      .nth(2)
      .evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
    await page.getByRole('button', { name: 'Accept' }).click();

    await E2ETestUtils.signMessageFuelWallet({ fuelWalletTestHelper, page });

    return { handle: newHandle, value };
  }
}
