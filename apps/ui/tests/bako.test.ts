import { test, expect } from '@playwright/test';
import { AuthTestService } from './ultils/service/auth-service';
import { getValueNewHandle, getVaultAddress, transfer } from './ultils/helpers';
import { Provider, Wallet } from 'fuels';

test.describe('Connect with Bako Safe', () => {
  test.afterEach(async ({ page }) => {
    await page.pause();
  });
  test('create new bako user', async ({ context }) => {
    const bakoIdPage = await context.newPage();
    const bakoSafePage = await context.newPage();
    await bakoIdPage.goto('/');

    await test.step('connect in Bako', async () => {
      await expect(bakoIdPage.getByText('Search new Handle')).toBeVisible();
      await bakoIdPage.getByRole('button', { name: 'Connect Wallet' }).click();
      await bakoIdPage.getByLabel('Connect to Bako Safe').click();
      const popup = await bakoIdPage.waitForEvent('popup');
      await AuthTestService.loginAuth(popup);

      await expect(
        bakoIdPage.getByRole('button', { name: 'My Handles' }),
      ).toBeVisible();

      await bakoSafePage.goto('https://safe.bako.global/home');
    });

    const newHandle = `automation${Date.now()}`;
    console.log('new handle: ', newHandle);

    await test.step('create new handle', async () => {
      await bakoIdPage
        .getByRole('textbox', { name: 'Search for an available Handle' })
        .fill(newHandle);
      await bakoIdPage.waitForTimeout(3000);
      await bakoIdPage
        .getByRole('button', {
          name: 'Continue',
        })
        .click();

      await expect(bakoIdPage.getByText(newHandle)).toBeVisible({
        timeout: 10000,
      });
      await expect(bakoIdPage.getByText('Handles0.001 ETH')).toBeVisible();

      const vaultAddress = await getVaultAddress(bakoSafePage);

      const { value } = await getValueNewHandle(bakoIdPage);

      const provider = new Provider('http://testnet.fuel.network/v1/graphql');
      const genesisWallet = Wallet.fromPrivateKey(
        '0x5ac4a3075cfeb0a1238efc082978aa6a7a2efe11e6f2ce2b564d708807fab6ad',
        provider,
      );
      await transfer(genesisWallet, value, vaultAddress);

      await bakoIdPage
        .getByRole('button', { name: 'Confirm Transaction' })
        .click();
      await bakoIdPage
        .getByLabel('Bako ID Terms Of Use Agreement')
        .locator('div')
        .filter({ hasText: '1. The Bako IDThe “Bako ID”' })
        .nth(2)
        .evaluate((el) => {
          el.scrollTop = el.scrollHeight;
        });
      const client = await bakoSafePage.context().newCDPSession(bakoSafePage);
      await client.send('WebAuthn.enable');
      await client.send('WebAuthn.addVirtualAuthenticator', {
        options: {
          protocol: 'ctap2',
          transport: 'internal',
          hasResidentKey: true,
          hasUserVerification: true,
          isUserVerified: true,
          automaticPresenceSimulation: true,
        },
      });
      await bakoIdPage.getByRole('button', { name: 'Accept' }).click();
    });
  });
});
