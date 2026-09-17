from locators.cart_locators import CART_ITEM, CART_SCREEN, CHECKOUT_BUTTON
from screens.base_screen import BaseScreen


class CartScreen(BaseScreen):
    def is_loaded(self) -> bool:
        return self._is_visible(CART_SCREEN)

    def item_count(self) -> int:
        return self._count(CART_ITEM)

    def proceed_to_checkout(self):
        self._step('Inicia o checkout a partir do carrinho')
        self._click(CHECKOUT_BUTTON)
