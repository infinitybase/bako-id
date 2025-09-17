import { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect, Page } from '@playwright/test';
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

  await expect(extensionPage.getByText('Send')).toBeVisible();
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
