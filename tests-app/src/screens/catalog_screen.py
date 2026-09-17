from locators.catalog_locators import (
    ADD_TO_CART_BUTTON,
    CART_BADGE_TEXT,
    CART_BUTTON,
    CATALOG_SCREEN,
)
from screens.base_screen import BaseScreen


class CatalogScreen(BaseScreen):
    def is_loaded(self) -> bool:
        return self._is_visible(CATALOG_SCREEN)

    def add_first_item_to_cart(self):
        self._step('Adiciona o primeiro produto ao carrinho')
        self._click(ADD_TO_CART_BUTTON)

    def cart_badge_count(self) -> int:
        return int(self._text(CART_BADGE_TEXT))

    def open_cart(self):
        self._step('Abre o carrinho')
        self._click(CART_BUTTON)
