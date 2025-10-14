import { FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { E2ETestUtils } from '../ultils/setup';
import { WalletUnlocked } from 'fuels';
import {
  getAddress,
  modalCloseTest,
  returnFundsToGenesisWallet,
  transfer,
} from '../ultils/helpers';
import { expect } from '@playwright/test';
import { AuthTestService } from '../ultils/service/auth-service';
import { NFTTestService } from '../ultils/service/nft-service';
import { NewHandleService } from '../ultils/service/new-handle';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe.serial('Connect with fuel wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;
  const garageUrl =
    process.env.PREVIEW_MODE === 'true'
      ? process.env.GARAGE_BASE_URL_PREVIEW!
      : process.env.GARAGE_BASE_URL_LOCAL!;

  test.beforeEach(async ({ extensionId, context, page }) => {
    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    genesisWallet = E2EUtils.genesisWallet;

    await page.goto(garageUrl);
  });

  test('login fuel wallet', async ({ page }) => {
    AuthTestService.loginWalletConnection(
      page,
      fuelWalletTestHelper,
      'Account 1',
    );
    const { address1 } = await getAddress(fuelWalletTestHelper);

    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();

    const buttonName = address1.substring(0, 5) + '...' + address1.slice(-2);
    await expect(page.getByRole('button', { name: buttonName })).toBeVisible();

    await page.getByRole('button', { name: buttonName }).click();
    await page.getByRole('menuitem', { name: 'Disconnect' }).click();

    await expect(
      page.getByRole('button', { name: 'Connect Wallet' }),
    ).toBeVisible();
  });

  test('create and login with passkey', async ({ page }) => {
    await AuthTestService.loginAuth(page);

    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();

    await page.waitForTimeout(2000);
    await page.locator('[id^="menu-button"]').click();
    await page.getByRole('menuitem', { name: 'Disconnect' }).click();

    await expect(
      page.getByRole('button', { name: 'Connect Wallet' }),
    ).toBeVisible();
  });

  test('mint NFT without tokens', async ({ page }) => {
    await test.step('login fuel-wallet', async () => {
      AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 1',
      );
    });

    await test.step('try mint 1 thermal punk', async () => {
      await page.getByRole('heading', { name: 'Thermal Punk' }).click();
      await page.getByRole('tab', { name: 'Mint' }).click();

      const mintButton = page.getByRole('button', { name: `Mint 1 NFT` });

      await expect(mintButton).toBeDisabled();

      await mintButton.hover();
      await expect(page.getByText('Not enough balance')).toBeVisible();
    });
  });

  test('mint 1 NFT and list by ETH', async ({ page }) => {
    await test.step('login fuel-wallet', async () => {
      AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 1',
      );
      const { address1 } = await getAddress(fuelWalletTestHelper);
      const value = 0.000005;

      await transfer(genesisWallet, value, address1);
    });

    await test.step('mint 1 thermal punk', async () => {
      await NFTTestService.mintNFT(page, fuelWalletTestHelper);
    });

    await test.step('confirm and list NFT received', async () => {
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);
    });
  });

  test('mint 2 NFT and list by ETH and Fuel', async ({ page }) => {
    await test.step('login fuel-wallet', async () => {
      AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 1',
      );
      const { address1 } = await getAddress(fuelWalletTestHelper);
      const value = 0.000005;

      await transfer(genesisWallet, value, address1);
    });

    await test.step('mint 2 thermal punk', async () => {
      await NFTTestService.mintNFT(
        page,
        fuelWalletTestHelper,
        'Thermal Punk',
        2,
      );
    });

    await test.step('confirm and list NFT received', async () => {
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);

      const modalList = page.getByRole('button', { name: 'List' }).first();
      await modalCloseTest(page, modalList);

      await page.getByRole('button', { name: 'Confirm listing' }).click();
      await expect(page.getByText('Amount is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Asset' }).click();
      await page.getByText('Fuel', { exact: true }).click();
      await page.getByRole('textbox', { name: 'Amount' }).click();
      await page.getByRole('textbox', { name: 'Amount' }).fill('0.00001');
      await page.getByRole('button', { name: 'Confirm listing' }).click();
      await E2ETestUtils.signMessageFuelWallet({
        fuelWalletTestHelper,
        page,
      });
      const listingPriceElements = page.locator('h2').filter({
        hasText: '0.00001',
        has: page.locator('img[src*="fuel.svg"]'),
      });
      await expect(listingPriceElements).toHaveCount(1);
    });

    await test.step('deslit NFT on profile', async () => {
      await page
        .locator('h2')
        .filter({
          hasText: '0.00001',
          has: page.locator('img[src*="fuel.svg"]'),
        })
        .click();
      await page.getByRole('button', { name: 'Delist NFT' }).click();
      await E2ETestUtils.signMessageFuelWallet({ fuelWalletTestHelper, page });
    });

    await test.step('deslit NFT on profile', async () => {
      await page.getByRole('img', { name: 'Logo' }).click();
      await page.getByRole('heading', { name: 'Thermal Punk' }).click();
      await page.getByRole('tab', { name: 'Items' }).click();

      await page.getByTestId('nft-sale-card').first().click();
      await page.getByRole('button', { name: 'Delist NFT' }).click();
      await E2ETestUtils.signMessageFuelWallet({ fuelWalletTestHelper, page });

      await page.getByRole('button', { name: 'Profile' }).click();
      await expect(page.getByRole('button', { name: 'List' })).toHaveCount(2);
    });

    await NFTTestService.listNFTs(page, fuelWalletTestHelper);

    await test.step('edit NFT listed', async () => {
      await test.step('edit asset and amount', async () => {
        await NFTTestService.editListedNFT(
          page,
          fuelWalletTestHelper,
          'Fuel',
          '2.001',
        );

        const listingPriceElements = page.locator('h2').filter({
          hasText: '2.001',
          has: page.locator('img[src*="fuel.svg"]'),
        });
        await expect(listingPriceElements).toHaveCount(1);
      });

      await test.step('edit asset', async () => {
        await NFTTestService.editListedNFT(
          page,
          fuelWalletTestHelper,
          'Ethereum',
          '2.001',
        );

        const listingPriceElements = page.locator('h2').filter({
          hasText: '2.001',
          has: page.locator('img[src*="eth.svg"]'),
        });
        await expect(listingPriceElements).toHaveCount(1);
      });

      await test.step('edit amount', async () => {
        await NFTTestService.editListedNFT(
          page,
          fuelWalletTestHelper,
          'Ethereum',
        );

        const listingPriceElements = page.locator('h2').filter({
          hasText: '2.001',
          has: page.locator('img[src*="eth.svg"]'),
        });
        await expect(listingPriceElements).toHaveCount(1);
      });
    });
  });

  test('mint 3 NFT and list by ETH', async ({ page }) => {
    await test.step('login fuel-wallet', async () => {
      AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 1',
      );
      const { address1 } = await getAddress(fuelWalletTestHelper);
      const value = 0.000008;

      await transfer(genesisWallet, value, address1);
    });

    await test.step('mint 3 thermal punk', async () => {
      await NFTTestService.mintNFT(
        page,
        fuelWalletTestHelper,
        'Thermal Punk',
        3,
      );
    });

    await test.step('confirm and list NFT received', async () => {
      await NFTTestService.listNFTs(page, fuelWalletTestHelper, 3);
    });
  });

  test('buy NFT without tokens', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await page.getByRole('heading', { name: 'Thermal Punk' }).click();
    await page.getByRole('tab', { name: 'Items' }).click();
    await page.getByTestId('nft-sale-card').first().click();

    const buyButton = page.getByRole('button', { name: `Buy` });
    await expect(buyButton).toBeDisabled();
    await buyButton.hover();
    await expect(page.getByText('Not enough balance')).toBeVisible();
  });

  test('buy and sell NFT', async ({ page }) => {
    let nftTitle: string;
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    const { address1, address2 } = await getAddress(fuelWalletTestHelper);

    await transfer(genesisWallet, 0.000015, address1);
    await test.step('purchase nft', async () => {
      nftTitle = await NFTTestService.buyNFT(
        page,
        fuelWalletTestHelper,
        'Thermal Punk',
      );

      await page.getByRole('button', { name: 'Profile' }).click();
      await expect(page.getByRole('button', { name: 'List' })).toBeVisible();
    });

    await test.step('list NFT purchased', async () => {
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);
      await expect(page.getByText(nftTitle)).toBeVisible();
    });

    await test.step('switch account and buy NFT listed', async () => {
      await transfer(genesisWallet, 0.000015, address2);
      const buttonName = address1.substring(0, 5) + '...' + address1.slice(-2);
      await expect(
        page.getByRole('button', { name: buttonName }),
      ).toBeVisible();

      await page.getByRole('button', { name: buttonName }).click();
      await page.getByRole('menuitem', { name: 'Disconnect' }).click();

      await AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 2',
      );
      await NFTTestService.buyNFT(page, fuelWalletTestHelper, 'Thermal Punk');
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);
    });

    await test.step('verify transaction in fuel explorer', async () => {
      await page.goto(
        `https://app-testnet.fuel.network/account/${address1}/transactions`,
      );

      await expect(page.getByText('Account')).toBeVisible();

      await page.getByText('Script').first().click();
      await expect(page.getByText('0.0000096')).toBeVisible();
    });
  });

  test('buy and sell NFT with handle', async ({ page }) => {
    await page.goto('https://preview.bako.id/');

    let newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    const { address1, address2 } = await getAddress(fuelWalletTestHelper);

    await test.step('create new handle', async () => {
      const { handle } = await NewHandleService.createNewHandle(
        page,
        fuelWalletTestHelper,
        genesisWallet,
        newHandle,
      );
      newHandle = handle;
    });

    await page.goto(garageUrl);
    let nftTitle: string;
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

    await transfer(genesisWallet, 0.000015, address1);
    await test.step('purchase nft', async () => {
      nftTitle = await NFTTestService.buyNFT(
        page,
        fuelWalletTestHelper,
        'Thermal Punk',
      );

      await page.getByRole('button', { name: 'Profile' }).click();
      await expect(page.getByRole('button', { name: 'List' })).toBeVisible();
    });

    await test.step('list NFT purchased', async () => {
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);
      await expect(page.getByText(nftTitle)).toBeVisible();
    });

    await test.step('switch account and buy NFT listed', async () => {
      await transfer(genesisWallet, 0.000015, address2);
      const buttonName = address1.substring(0, 5) + '...' + address1.slice(-2);
      await expect(
        page.getByRole('button', { name: buttonName }),
      ).toBeVisible();

      await page.getByRole('button', { name: buttonName }).click();
      await page.getByRole('menuitem', { name: 'Disconnect' }).click();

      await AuthTestService.loginWalletConnection(
        page,
        fuelWalletTestHelper,
        'Account 2',
      );
      await NFTTestService.buyNFT(page, fuelWalletTestHelper, 'Thermal Punk');
      await NFTTestService.listNFTs(page, fuelWalletTestHelper);
    });

    await test.step('verify transaction in fuel explorer', async () => {
      await page.goto(
        `https://app-testnet.fuel.network/account/${address1}/transactions`,
      );

      await expect(page.getByText('Account')).toBeVisible();

      await page.getByText('Script').first().click();
      await expect(page.getByText('0.0000097')).toBeVisible();
    });
  });
});
