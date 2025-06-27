import { BrowserContext, expect, Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

export async function createNewHandle(page: Page) {
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

  const connectedAddress = await page
    .getByRole('textbox', { name: 'Address' })
    .inputValue();

  return { value, connectedAddress };
}

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
  context: BrowserContext;
  extensionId: string;
  genesisAddress: string;
}) {
  const { context, extensionId, genesisAddress } = config;

  const extensionPage = await context.newPage();
  await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);

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
