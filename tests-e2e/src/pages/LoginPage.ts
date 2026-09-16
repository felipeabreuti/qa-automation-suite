import { Page, expect } from '@playwright/test';
import { loginLocators } from '../locators/login.locators';
import { Credentials } from '../data/users';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
    await expect(this.page.locator(loginLocators.loginButton)).toBeVisible();
  }

  async login({ username, password }: Credentials) {
    await this.page.locator(loginLocators.usernameInput).fill(username);
    await this.page.locator(loginLocators.passwordInput).fill(password);
    await this.page.locator(loginLocators.loginButton).click();
  }

  async expectLoginError(message: string) {
    await expect(this.page.locator(loginLocators.errorMessage)).toHaveText(message);
    await expect(this.page).toHaveURL(/\/$/);
  }
}
