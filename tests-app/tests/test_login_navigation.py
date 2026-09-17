from data.users import LOCKED_OUT_USER, STANDARD_USER
from screens.catalog_screen import CatalogScreen
from screens.login_screen import LoginScreen


def test_login_valid_user_reaches_catalog(driver):
    """Login com standard_user leva ao catálogo de produtos."""
    login_screen = LoginScreen(driver)
    catalog_screen = CatalogScreen(driver)

    assert login_screen.is_loaded(), 'App não abriu na tela de login'

    login_screen.login(STANDARD_USER)

    assert catalog_screen.is_loaded(), 'Catálogo de produtos não foi exibido após o login'


def test_login_locked_out_user_shows_error(driver):
    """Usuário bloqueado permanece no login com a mensagem de bloqueio."""
    login_screen = LoginScreen(driver)

    login_screen.login(LOCKED_OUT_USER)

    assert login_screen.error_message() == 'Sorry, this user has been locked out.'
    assert login_screen.is_loaded(), 'Usuário bloqueado saiu da tela de login'
