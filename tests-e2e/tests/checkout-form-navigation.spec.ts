import { test } from '../src/fixtures/pages.fixture';
import { standardUser } from '../src/data/users';

test.describe('Checkout E2E', () => {
  test('navegação do catálogo até o formulário de checkout', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await loginPage.open();
    await loginPage.login(standardUser);
    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.expectCartBadge(1);

    await inventoryPage.openCart();
    await cartPage.expectLoadedWithItems(1);

    await cartPage.proceedToCheckout();
    await checkoutPage.expectInformationForm();
  });
});
