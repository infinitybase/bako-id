import { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { Page, expect } from '@playwright/test';
import { E2ETestUtils } from '../setup';
import { modalCloseTest, mockAssets } from '../helpers';

export class NFTTestService {
  static async mintNFT(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    collectionName: string = 'Thermal Punk',
    quantity: number = 1,
  ): Promise<void> {
    await page.getByRole('heading', { name: collectionName }).click();
    await page.getByRole('tab', { name: 'Mint' }).click();

    for (let i = 1; i < quantity; i++) {
      await page.getByRole('button', { name: 'Increase quantity' }).click();
    }

    await page
      .getByRole('button', {
        name: `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`,
      })
      .click();

    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    await expect(page.locator('.chakra-modal__content')).toBeVisible();

    await page.getByTestId('close-modal-button').click();
  }

  static async listNFTs(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    quantity: number = 1,
  ): Promise<void> {
    await page.getByRole('button', { name: 'Profile' }).click();
    await page.waitForTimeout(1000);

    if (await page.getByText('No items found').isVisible()) {
      await page.getByRole('img', { name: 'Logo' }).click();
      await page.getByRole('button', { name: 'Profile' }).click();
    }

    await mockAssets(page);

    for (let i = 0; i < quantity; i++) {
      const modalList = page.getByRole('button', { name: 'List' }).first();
      await modalCloseTest(page, modalList);

      await page.getByRole('button', { name: 'Confirm listing' }).click();
      await expect(page.getByText('Amount is required')).toBeVisible();

      await page.getByRole('textbox', { name: 'Asset' }).click();
      await page.getByText('Ethereum').click();
      await page.getByRole('textbox', { name: 'Amount' }).click();
      await page.getByRole('textbox', { name: 'Amount' }).fill('0.00001');
      await page.getByRole('button', { name: 'Confirm listing' }).click();
      await E2ETestUtils.signMessageFuelWallet({
        fuelWalletTestHelper,
        page,
      });
    }

    const listingPriceElements = page.locator('h2').filter({
      hasText: '0.00001',
      has: page.locator('img[src*="eth.svg"]'),
    });
    await expect(listingPriceElements).toHaveCount(quantity);
  }

  static async editListedNFT(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    assetName: string = 'Fuel',
    amount: string = '0.00001',
  ): Promise<void> {
    await page.getByTestId('nft-sale-card').first().click();
    await page.getByRole('button', { name: 'Edit order' }).click();
    await mockAssets(page);
    await page.getByRole('textbox', { name: 'Asset' }).click();
    await page.getByText(assetName, { exact: true }).click();
    await page.getByRole('textbox', { name: 'Amount' }).fill(amount);
    await page.getByRole('button', { name: 'Save new price' }).click();
    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });
  }

  static async buyNFT(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    collectionName: string = 'Thermal Punk',
    nftIndex: number = 0,
  ): Promise<string> {
    await page.getByRole('heading', { name: collectionName }).click();
    await page.getByRole('tab', { name: 'Items' }).click();
    const nftCard = page.getByTestId('nft-sale-card').nth(nftIndex);
    const nftContent = await nftCard.locator('p').first().textContent();
    const nftInfo = nftContent || 'NFT content not found';

    await nftCard.click();

    await page.getByRole('button', { name: 'Buy' }).click();

    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    const closeButton = page.getByTestId('close-modal-button');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }

    return nftInfo;
  }
}
