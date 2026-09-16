import { Page, expect } from '@playwright/test';
import { checkoutLocators } from '../locators/checkout.locators';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectInformationForm() {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.page.locator(checkoutLocators.title)).toHaveText('Checkout: Your Information');
    await expect(this.page.locator(checkoutLocators.firstNameInput)).toBeVisible();
    await expect(this.page.locator(checkoutLocators.lastNameInput)).toBeVisible();
    await expect(this.page.locator(checkoutLocators.postalCodeInput)).toBeVisible();
    await expect(this.page.locator(checkoutLocators.continueButton)).toBeEnabled();
  }
}
