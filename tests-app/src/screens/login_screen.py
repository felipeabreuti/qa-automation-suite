from data.users import Credentials
from locators.login_locators import (
    ERROR_MESSAGE_TEXT,
    LOGIN_BUTTON,
    LOGIN_SCREEN,
    PASSWORD_INPUT,
    USERNAME_INPUT,
)
from screens.base_screen import BaseScreen


class LoginScreen(BaseScreen):
    def is_loaded(self) -> bool:
        return self._is_visible(LOGIN_SCREEN)

    def login(self, user: Credentials):
        self._step(f'Login com o usuário "{user.username}"')
        self._type(USERNAME_INPUT, user.username)
        self._type(PASSWORD_INPUT, user.password)
        self._click(LOGIN_BUTTON)

    def error_message(self) -> str:
        return self._text(ERROR_MESSAGE_TEXT)
