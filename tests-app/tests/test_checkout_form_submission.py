from data.checkout import DEFAULT_PERSONAL_INFO
from data.users import STANDARD_USER
from screens.cart_screen import CartScreen
from screens.catalog_screen import CatalogScreen
from screens.checkout_screen import CheckoutScreen
from screens.login_screen import LoginScreen


def test_checkout_form_submission_reaches_overview(driver):
    """Login, adiciona um produto, preenche o formulário de checkout e chega ao resumo do pedido."""
    login_screen = LoginScreen(driver)
    catalog_screen = CatalogScreen(driver)
    cart_screen = CartScreen(driver)
    checkout_screen = CheckoutScreen(driver)

    login_screen.login(STANDARD_USER)
    assert catalog_screen.is_loaded(), 'Catálogo de produtos não foi exibido após o login'

    catalog_screen.add_first_item_to_cart()
    assert catalog_screen.cart_badge_count() == 1

    catalog_screen.open_cart()
    assert cart_screen.is_loaded(), 'Tela do carrinho não foi exibida'
    assert cart_screen.item_count() == 1

    cart_screen.proceed_to_checkout()
    assert checkout_screen.is_information_form_loaded(), 'Formulário de checkout não foi exibido'

    checkout_screen.fill_personal_info(DEFAULT_PERSONAL_INFO)
    checkout_screen.submit_personal_info()

    assert checkout_screen.is_overview_loaded(), 'Resumo do pedido não foi exibido após enviar o formulário'
