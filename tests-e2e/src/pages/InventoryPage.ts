import { Page, expect } from '@playwright/test';
import { inventoryLocators } from '../locators/inventory.locators';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async addBackpackToCart() {
    await this.page.locator(inventoryLocators.addBackpackButton).click();
  }

  async openCart() {
    await this.page.locator(inventoryLocators.cartLink).click();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.page.locator(inventoryLocators.title)).toHaveText('Products');
  }

  async expectCartBadge(count: number) {
    await expect(this.page.locator(inventoryLocators.cartBadge)).toHaveText(String(count));
  }
}
