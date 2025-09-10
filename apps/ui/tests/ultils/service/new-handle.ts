import { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';

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
}
