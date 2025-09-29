import { FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { E2ETestUtils } from '../ultils/setup';
import { WalletUnlocked } from 'fuels';
import { returnFundsToGenesisWallet, transfer } from '../ultils/helpers';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Connect with fuel wallet', () => {
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

  test.afterEach(async ({ extensionId, context }) => {
    const genesisAddress = genesisWallet.address.toString();

    await returnFundsToGenesisWallet({
      context,
      extensionId,
      genesisAddress,
    });
  });

  test('mint 1 NFT', async ({ page }) => {
    await page.goto('https://preview.garage.zone/');
    await page.getByRole('button', { name: 'Connect Wallet' }).dblclick();
    await page.getByLabel('Connect to Fuel Wallet').click();
    await fuelWalletTestHelper.walletConnect();
    await page.locator('[id^="menu-button"]').click();
    await page.getByRole('menuitem').nth(1).click();

    const connectedAddress = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    const value = 0.000005;

    await transfer(genesisWallet, value, connectedAddress);

    await page.getByRole('heading', { name: 'Thermal Punks' }).click();
    await page.getByRole('button', { name: 'Mint 1 NFT' }).click();

    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });
  });

  test('mint 2 NFT', async ({ page }) => {
    await page.goto('https://preview.garage.zone/');
    await page.getByRole('button', { name: 'Connect Wallet' }).dblclick();
    await page.getByLabel('Connect to Fuel Wallet').click();
    await fuelWalletTestHelper.walletConnect();
    await page.locator('[id^="menu-button"]').click();
    await page.getByRole('menuitem').nth(1).click();

    const connectedAddress = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    const value = 0.000005;

    await transfer(genesisWallet, value, connectedAddress);

    await page.getByRole('heading', { name: 'Thermal Punks' }).click();
    await page.getByRole('button', { name: 'Mint 2 NFTs' }).click();

    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });
  });
});
