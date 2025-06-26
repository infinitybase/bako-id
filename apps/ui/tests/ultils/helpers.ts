import { Page } from '@playwright/test';
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
  const value = parseFloat(estimatedTotal.replace('ETH', '').trim());

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
