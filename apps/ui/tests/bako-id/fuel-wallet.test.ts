import { expect, FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { E2ETestUtils } from '../ultils/setup';
import { WalletUnlocked } from 'fuels';
import {
  getValueNewHandle,
  editProfile,
  returnFundsToGenesisWallet,
  transfer,
  getAddress,
} from '../ultils/helpers';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Connect with Fuel Wallet', () => {
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

    const walletPage = fuelWalletTestHelper.getWalletPage();

    const closeButton = walletPage.getByRole('button', {
      name: 'Close dialog',
    });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }

    await fuelWalletTestHelper.addAccount();
    await fuelWalletTestHelper.switchAccount('Account 1');
  });

  // test.afterEach(async ({ extensionId, context, page }) => {
  //   await page.pause();
  //   await fuelWalletTestHelper.switchAccount('Account 1');
  //   const genesisAddress = genesisWallet.address.toString();

  //   await returnFundsToGenesisWallet({
  //     context,
  //     extensionId,
  //     genesisAddress,
  //   });
  // });

  test('search an existing profile', async ({ page, context }) => {
    await expect(page.getByText('Search new Handle')).toBeVisible();

    await page
      .getByRole('textbox', { name: 'Search for an available Handle' })
      .fill('@pengus');
    await expect(page.getByText('Registered')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.goto('https://preview.bako.id/profile/pengus');

    await expect(page.getByRole('heading', { name: 'For sale' })).toBeVisible();
    await expect(page.getByText('owner0xbd58281c...8ebc4')).toBeVisible();

    const [secondTab] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('button', { name: 'Explorer' }).click(),
    ]);

    await secondTab.waitForLoadState();

    await secondTab.getByRole('heading', { name: 'Account' }).click();
  });

  test('search invalid handle', async ({ page }) => {
    await expect(page.getByText('Search new Handle')).toBeVisible();

    await test.step('shows error for short handle', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill('@bk');

      await expect(page.getByText('Not supported')).toBeVisible();
      await expect(
        page.getByText('Handle must be at least 3 characters long.'),
      ).toBeVisible();
    });

    await test.step('filters unsupported characters from handle', async () => {
      const invalidHandle = 'bako 123100 !! // --';
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(invalidHandle);

      await expect(
        page.getByRole('textbox', { name: 'Search for an available Handle' }),
      ).not.toHaveValue(invalidHandle);
      await expect(
        page.getByRole('textbox', { name: 'Search for an available Handle' }),
      ).toHaveValue('@bako123100');
      await expect(page.getByText('Available')).toBeVisible();
    });
  });

  test.skip('create new handle', async ({ page }) => {
    await test.step('connect wallet', async () => {
      await expect(page.getByText('Search new Handle')).toBeVisible();
      await page.getByRole('button', { name: 'Connect Wallet' }).click();
      await page.getByLabel('Connect to Fuel Wallet').click();
      await fuelWalletTestHelper.walletConnect();
      await expect(
        page.getByRole('button', { name: 'My Handles' }),
      ).toBeVisible();
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    await test.step('create new handle', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText(newHandle)).toBeVisible();
      await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

      const { value, connectedAddress } = await getValueNewHandle(page);
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

    await test.step('edit user', async () => {
      await page.getByRole('img', { name: 'Bako logo' }).click();
      await page.waitForTimeout(2500);
      await page.reload();

      await page.getByRole('button', { name: `${newHandle} avatar` }).click();
      await page.getByRole('menuitem', { name: 'Profile' }).click();

      await expect(
        page.getByText(`@${newHandle}`, { exact: true }),
      ).toBeVisible();

      await page.getByRole('button', { name: 'Edit Profile' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Nickname$/ })
        .first()
        .click();
      await page
        .getByRole('textbox', { name: 'Nickname' })
        .fill(`${newHandle}`);
      await page.getByRole('button', { name: 'Save' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Short bio$/ })
        .first()
        .click();
      await page.getByRole('textbox', { name: 'Bio' }).fill('Short bio test');
      await page.getByRole('button', { name: 'Save' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Website$/ })
        .first()
        .click();
      await page
        .getByRole('textbox', { name: 'Website' })
        .fill('https://www.bako.global/');
      await page.getByRole('button', { name: 'Save' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Location$/ })
        .first()
        .click();
      await page.getByRole('textbox', { name: 'Location' }).fill('Brazil');
      await page.getByRole('button', { name: 'Save' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Twitter$/ })
        .first()
        .click();
      await page
        .getByRole('textbox', { name: 'X' })
        .fill('https://x.com/infinitybase_');
      await page.getByRole('button', { name: 'Save' }).click();
      try {
        await page.getByRole('button', { name: 'Save changes' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
      } catch {
        await page.getByRole('button', { name: 'Save changes' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
      }
      const { value, connectedAddress } =
        await editProfile(fuelWalletTestHelper);

      await transfer(genesisWallet, value, connectedAddress);

      await E2ETestUtils.signMessageFuelWallet({
        fuelWalletTestHelper,
        page,
      });
    });
  });

  test.only('create new handle to other resolver', async ({ page }) => {
    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    let address1: string;
    let address2: string;

    await test.step('create new handle to other resolver', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText(newHandle)).toBeVisible();
      await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

      const { value } = await getValueNewHandle(page);

      await test.step('connect address 1', async () => {
        try {
          await page.getByRole('button', { name: 'Connect Wallet' }).click();
          await page.getByLabel('Connect to Fuel Wallet').click();
        } catch {
          await page
            .getByRole('button', { name: 'Connect Wallet' })
            .nth(1)
            .click();
          await page.getByLabel('Connect to Fuel Wallet').click();
        }

        ({ address1, address2 } = await getAddress(fuelWalletTestHelper));

        await transfer(genesisWallet, value, address1);
        await page.waitForTimeout(500);

        await fuelWalletTestHelper.walletConnect(['Account 1']);
      });

      await page.getByRole('textbox', { name: 'Address' }).fill(address2);

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

    await test.step('verify owner datas', async () => {
      await page.getByRole('img', { name: 'Bako logo' }).click();
      await page.waitForTimeout(2500);

      await page.getByRole('button', { name: /.* avatar$/ }).click();
      await page.getByRole('menuitem', { name: 'Profile' }).click();

      try {
        await expect(page.getByText(`BID @${newHandle}`)).toBeVisible();
      } catch {
        await page.reload();
        await expect(page.getByText(`BID @${newHandle}`)).toBeVisible();
      }

      await page.getByRole('button', { name: 'My Handles' }).click();
      await page.getByText(`${newHandle}`).click();

      const shortened1 = `${address1.slice(0, 10)}...${address1.slice(-5)}`;

      await expect(page.getByText(`owner${shortened1}`)).toBeVisible();
    });

    await test.step('verify data', async () => {
      await page.getByRole('button', { name: /.* avatar$/ }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).dblclick();

      await page.getByRole('button', { name: 'Connect Wallet' }).click();
      await page.getByLabel('Connect to Fuel Wallet').dblclick();

      await fuelWalletTestHelper.walletConnect(['Account 2']);

      await page.getByRole('button', { name: `${newHandle} avatar` }).click();
      await page.getByRole('menuitem', { name: 'Profile' }).click();

      await expect(
        page.getByRole('button', { name: 'Edit Profile' }),
      ).not.toBeVisible();

      await page.getByRole('button', { name: 'My Handles' }).click();
      await expect(page.getByText('It seems like you haven’t')).toBeVisible();
    });
  });
});
