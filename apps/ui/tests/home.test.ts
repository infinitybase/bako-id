import { expect, FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { E2ETestUtils } from './ultils/setup';
import { randomUUID, WalletUnlocked } from 'fuels';
import { createNewHandle, transfer } from './ultils/helpers';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Home Page', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ extensionId, context, page }) => {
    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    genesisWallet = E2EUtils.genesisWallet;
  });

  test('search an existing profile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Search new Handle')).toBeVisible();

    await page
      .getByRole('textbox', { name: 'Search for an available Handle' })
      .fill('@limpacache');
    await expect(page.getByText('Registered')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.goto('https://preview.bako.id/profile/pengus');
  });

  test.only('connect wallet and create a new handle', async ({ page }) => {
    await expect(page.getByText('Search new Handle')).toBeVisible();

    await page.getByRole('button', { name: 'Connect Wallet' }).click();
    await page.getByLabel('Connect to Fuel Wallet').click();

    await fuelWalletTestHelper.walletConnect();

    await expect(
      page.getByRole('button', { name: 'My Handles' }),
    ).toBeVisible();

    const newHandle = `automation${randomUUID().slice(0, 4)}`;
    console.log('new handle: ', newHandle);
    await page
      .getByRole('textbox', { name: 'Search for an available Handle' })
      .fill(newHandle);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText(newHandle)).toBeVisible();
    await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

    const { value, connectedAddress } = await createNewHandle(page);
    console.log(value, connectedAddress);
    await transfer(genesisWallet, value, connectedAddress);

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
  });
});
