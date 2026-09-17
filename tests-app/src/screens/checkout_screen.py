from data.checkout import PersonalInfo
from locators.checkout_locators import (
    CONTINUE_BUTTON,
    FIRST_NAME_INPUT,
    INFORMATION_SCREEN,
    LAST_NAME_INPUT,
    OVERVIEW_SCREEN,
    POSTAL_CODE_INPUT,
)
from screens.base_screen import BaseScreen


class CheckoutScreen(BaseScreen):
    def is_information_form_loaded(self) -> bool:
        return self._is_visible(INFORMATION_SCREEN)

    def fill_personal_info(self, info: PersonalInfo):
        self._step(f'Preenche o formulário com {info.first_name} {info.last_name}, CEP {info.postal_code}')
        self._type(FIRST_NAME_INPUT, info.first_name)
        self._type(LAST_NAME_INPUT, info.last_name)
        self._type(POSTAL_CODE_INPUT, info.postal_code)

    def submit_personal_info(self):
        self._step('Envia o formulário de checkout')
        self._click(CONTINUE_BUTTON)

    def is_overview_loaded(self) -> bool:
        return self._is_visible(OVERVIEW_SCREEN)
