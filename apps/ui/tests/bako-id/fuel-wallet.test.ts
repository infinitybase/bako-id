import { expect, FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { E2ETestUtils } from '../ultils/setup';
import { WalletUnlocked } from 'fuels';
import {
  returnFundsToGenesisWallet,
  transfer,
  getAddress,
} from '../ultils/helpers';
import { NewHandleService } from '../ultils/service/new-handle';
import { AuthTestService } from '../ultils/service/auth-service';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Connect with Fuel Wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async () => {
    if (!fuelWalletTestHelper) {
      return;
    }
    await fuelWalletTestHelper.switchAccount('Account 1');
    const genesisAddress = genesisWallet.address.toString();

    await returnFundsToGenesisWallet({
      fuelWalletTestHelper,
      genesisAddress,
    });
  });

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

  test('create new handle and edit profile', async ({
    page,
    context,
    extensionId,
  }) => {
    await test.step('setup fuel wallet', async () => {
      const E2EUtils = await E2ETestUtils.setupFuelWallet({
        page,
        context,
        extensionId,
      });

      fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
      genesisWallet = E2EUtils.genesisWallet;
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    const { address1 } = await getAddress(fuelWalletTestHelper);

    await test.step('create new handle', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText(newHandle)).toBeVisible();
      await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

      const value = await NewHandleService.getValueNewHandle(page);

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

        await transfer(genesisWallet, value, address1);
        await page.waitForTimeout(500);

        await fuelWalletTestHelper.walletConnect(['Account 1']);
      });

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
      await page.waitForTimeout(1500);
      const newHandleButton = page.getByRole('button', {
        name: `${newHandle} avatar`,
      });
      if (!(await newHandleButton.isVisible())) {
        await page.reload();
      }
      await page.waitForTimeout(500);

      const connectButton = page.getByRole('button', {
        name: 'Connect Wallet',
      });
      if (await connectButton.isVisible()) {
        await connectButton.click();
        await page.getByLabel('Connect to Fuel Wallet').click();
        await fuelWalletTestHelper.walletConnect(['Account 1']);
      }

      await newHandleButton.click();
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
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Short bio$/ })
        .first()
        .click();
      await page.getByRole('textbox', { name: 'Bio' }).fill('Short bio test');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Website$/ })
        .first()
        .click();
      await page
        .getByRole('textbox', { name: 'Website' })
        .fill('https://www.bako.global/');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Location$/ })
        .first()
        .click();
      await page.getByRole('textbox', { name: 'Location' }).fill('Brazil');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await page
        .locator('div')
        .filter({ hasText: /^Twitter$/ })
        .first()
        .click();
      await page
        .getByRole('textbox', { name: 'X' })
        .fill('https://x.com/infinitybase_');
      await page.getByRole('button', { name: 'Save', exact: true }).click();

      await page.getByRole('button', { name: 'Save changes' }).click();
      await page.getByRole('button', { name: 'Confirm' }).click();

      const value = 0.000005;

      await transfer(genesisWallet, value, address1);

      await E2ETestUtils.signMessageFuelWallet({
        fuelWalletTestHelper,
        page,
      });
    });
  });

  test('create new handle to other resolver', async ({
    extensionId,
    context,
    page,
  }) => {
    await test.step('setup fuel wallet', async () => {
      const E2EUtils = await E2ETestUtils.setupFuelWallet({
        page,
        context,
        extensionId,
      });

      fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
      genesisWallet = E2EUtils.genesisWallet;
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    const { address1, address2 } = await getAddress(fuelWalletTestHelper);

    await test.step('create new handle to other resolver', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText(newHandle)).toBeVisible();
      await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

      const value = await NewHandleService.getValueNewHandle(page);

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
      await page.waitForTimeout(1500);
      await page.reload();
      await page.waitForTimeout(500);

      const connectButton = page.getByRole('button', {
        name: 'Connect Wallet',
      });
      if (await connectButton.isVisible()) {
        await connectButton.click();
        await page.getByLabel('Connect to Fuel Wallet').click();
        await fuelWalletTestHelper.walletConnect(['Account 1']);
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

  test('create a new handle without assets', async ({
    page,
    context,
    extensionId,
  }) => {
    await test.step('setup fuel wallet', async () => {
      const E2EUtils = await E2ETestUtils.setupFuelWallet({
        page,
        context,
        extensionId,
      });

      fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
      genesisWallet = E2EUtils.genesisWallet;
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    await test.step('connect address 1', async () => {
      await page.getByRole('button', { name: 'Connect Wallet' }).click();
      await page.getByLabel('Connect to Fuel Wallet').click();

      await page.waitForTimeout(500);

      await fuelWalletTestHelper.walletConnect(['Account 1']);
    });

    await page
      .getByRole('textbox', { name: 'Search for an available Handle' })
      .fill(newHandle);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText(newHandle)).toBeVisible();
    await expect(
      page.getByText(
        /You need at least\s*[0-9]+(?:\.[0-9]+)?\s*ETH to buy this domain\./i,
      ),
    ).toBeVisible();
  });

  test('create and search new handle', async ({
    page,
    context,
    extensionId,
  }) => {
    await test.step('setup fuel wallet', async () => {
      const E2EUtils = await E2ETestUtils.setupFuelWallet({
        page,
        context,
        extensionId,
      });

      fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
      genesisWallet = E2EUtils.genesisWallet;
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    const { address1 } = await getAddress(fuelWalletTestHelper);

    await test.step('create new handle', async () => {
      await page
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page.getByText(newHandle)).toBeVisible();
      await expect(page.getByText('Handles0.001 ETH')).toBeVisible();

      const value = await NewHandleService.getValueNewHandle(page);

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

        await transfer(genesisWallet, value, address1);
        await page.waitForTimeout(500);

        await fuelWalletTestHelper.walletConnect(['Account 1']);
      });

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

      await page.getByRole('img', { name: 'Bako logo' }).click();
      await page.waitForTimeout(1500);
      const newHandleButton = page.getByRole('button', {
        name: `${newHandle} avatar`,
      });
      if (!(await newHandleButton.isVisible())) {
        await page.reload();
      }
      await page.waitForTimeout(500);

      const connectButton = page.getByRole('button', {
        name: 'Connect Wallet',
      });
      if (await connectButton.isVisible()) {
        await connectButton.click();
        await page.getByLabel('Connect to Fuel Wallet').click();
        await fuelWalletTestHelper.walletConnect(['Account 1']);
      }

      await newHandleButton.click();
      await page.getByRole('menuitem', { name: 'Profile' }).click();

      await expect(
        page.getByText(`@${newHandle}`, { exact: true }),
      ).toBeVisible();
    });

    await test.step('search handle in Fuel Wallet', async () => {
      const extensionPage = fuelWalletTestHelper.getWalletPage();

      await extensionPage.getByRole('button', { name: 'Send Button' }).click();
      await extensionPage
        .getByRole('textbox', { name: 'Address Input' })
        .fill(`@${newHandle}`);
      await expect(
        extensionPage
          .getByRole('menu', { name: `@${newHandle}` })
          .locator('div')
          .nth(1),
      ).toBeVisible();
      await page.getByRole('button', { name: 'Back' }).click();
    });

    await test.step('search handle in bako safe', async () => {
      await page.goto('https://safe.bako.global/');

      await AuthTestService.loginAuth(page);

      await page.getByRole('img', { name: 'Close window' }).click();

      await page.getByRole('button', { name: 'Home' }).click();
      await page.getByTestId('adressBookTab').click();
      await page.getByLabel('Select networks').click();
      await page.getByText('Fuel Sepolia Testnet').click();
      await page.getByRole('button', { name: 'Add new favorite' }).click();
      const modal = page.locator('[id^="chakra-modal--body-"]');
      await modal
        .first()
        .getByLabel('Name or Label', { exact: true })
        .fill(`new Handle`);
      await modal
        .nth(1)
        .getByLabel('Address', { exact: true })
        .fill(`@${newHandle}`);
      await expect(page.locator('circle').nth(3)).not.toBeVisible();
      const addButton = page
        .locator('button[aria-label="Create address book"]')
        .first();
      await page.waitForTimeout(2000);
      await addButton.evaluate((el: HTMLButtonElement) => el.click());
      await expect(
        page.getByRole('heading', { name: 'new handle' }),
      ).toBeVisible();
    });
  });
});
