import { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect, Locator, Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

export async function transfer(
  genesisWallet: WalletUnlocked,
  value: number,
  connectedAddress: string,
) {
  const baseUnits = Math.floor(value * 1e9).toString();

  const transfer = await genesisWallet.transfer(connectedAddress, baseUnits);

  await transfer.waitForResult();

  console.log(`Transferido ${baseUnits} base units para ${connectedAddress}`);
}

export async function modalCloseTest(page: Page, element: Locator) {
  await element.click();
  await page.getByLabel('Close modal').click();
  await page.waitForTimeout(750);
  await element.click();
  await page.getByText('Cancel').click();
  await page.waitForTimeout(750);
  await element.click();
}

export async function returnFundsToGenesisWallet(config: {
  fuelWalletTestHelper: FuelWalletTestHelper;
  genesisAddress: string;
}) {
  const { fuelWalletTestHelper, genesisAddress } = config;

  const extensionPage = fuelWalletTestHelper.getWalletPage();

  await extensionPage.waitForTimeout(2000);

  const isZeroBalance = await extensionPage
    .locator('p[data-account-name="Account 1"]')
    .evaluate((el) => {
      const text = el.textContent ?? '';
      const value = parseFloat(text.replace('$', '').trim());
      return value === 0;
    });

  if (isZeroBalance) {
    console.log('No ETH balance found to return to genesis wallet.');
    return;
  }

  await extensionPage.getByRole('button', { name: 'Send Button' }).click();
  await extensionPage.getByRole('combobox', { name: 'Select Asset' }).click();
  await extensionPage
    .getByRole('menuitem', { name: 'Ethereum Ethereum ETH' })
    .click();
  await extensionPage
    .getByRole('textbox', { name: 'Address Input' })
    .fill(genesisAddress);
  await extensionPage.getByRole('button', { name: 'Max' }).click();

  await extensionPage.waitForTimeout(1500);
  const reviewButton = extensionPage.getByRole('button', { name: 'Review' });
  await expect(reviewButton).toBeEnabled();
  await reviewButton.click();

  await extensionPage.waitForTimeout(1500);
  const submitButton = extensionPage.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(
    extensionPage.getByRole('dialog').getByText('Send', { exact: true }),
  ).toBeVisible({
    timeout: 8000,
  });
  await expect(extensionPage.getByText('success')).toBeVisible();
}

export async function getVaultAddress(page: Page) {
  await page.getByLabel('Select networks').click();
  await page.getByText('Fuel Sepolia Testnet').click();
  await page.getByRole('heading', { name: 'Personal Vault' }).click();
  await page.getByRole('img', { name: 'Close window' }).locator('path').click();
  await page.getByRole('button', { name: 'Sidebar Vault Address' }).click();
  return await page.evaluate(() => navigator.clipboard.readText());
}

export async function getAddress(fuelWalletTestHelper: FuelWalletTestHelper) {
  const walletPage = fuelWalletTestHelper.getWalletPage();

  await walletPage.getByRole('button', { name: 'Accounts' }).click();

  await walletPage
    .getByRole('article', { name: 'Account 1' })
    .getByLabel('Copy to clipboard')
    .click();
  const address1 = await walletPage.evaluate(() =>
    navigator.clipboard.readText(),
  );
  await walletPage
    .getByRole('article', { name: 'Account 2' })
    .getByLabel('Copy to clipboard')
    .click();
  const address2 = await walletPage.evaluate(() =>
    navigator.clipboard.readText(),
  );

  await walletPage
    .getByRole('button', {
      name: 'Close dialog',
    })
    .click();

  return { address1, address2 };
}

export async function mockAssets(page: Page) {
  await page.route('**/assets', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
          fees: [400, 300],
        },
        {
          id: '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b',
          fees: [100, 0],
        },
      ]),
    });
  });
}
