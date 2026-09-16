import { Page, expect } from '@playwright/test';
import { cartLocators } from '../locators/cart.locators';

export class CartPage {
  constructor(private readonly page: Page) {}

  async proceedToCheckout() {
    await this.page.locator(cartLocators.checkoutButton).click();
  }

  async expectLoadedWithItems(count: number) {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.page.locator(cartLocators.title)).toHaveText('Your Cart');
    await expect(this.page.locator(cartLocators.cartItem)).toHaveCount(count);
  }
}
