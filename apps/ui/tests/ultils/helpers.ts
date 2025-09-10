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

  const ethValue = await extensionPage.evaluate(() => {
    const el = document.querySelector('p[data-account-name="Account 1"]');
    if (!el || !el.textContent) return 0;
    const parts = el.textContent.split('ETH');
    if (parts.length < 2) return 0;
    return parseFloat(parts[1].trim());
  });
  if (ethValue === 0) {
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
  await extensionPage.getByRole('button', { name: 'Review' }).click();
  await extensionPage.getByRole('button', { name: 'Submit' }).click();

  await expect(extensionPage.getByText('Transaction sent')).toBeVisible();
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
