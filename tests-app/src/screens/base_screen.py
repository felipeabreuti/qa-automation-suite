import logging

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

DEFAULT_TIMEOUT = 20

step_log = logging.getLogger('steps')


class BaseScreen:
    def __init__(self, driver, timeout: int = DEFAULT_TIMEOUT):
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)

    def _step(self, message: str):
        step_log.info(message)

    def _visible(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def _is_visible(self, locator) -> bool:
        try:
            self._visible(locator)
            return True
        except TimeoutException:
            return False

    def _click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()

    def _type(self, locator, text: str):
        self._visible(locator).send_keys(text)

    def _text(self, locator) -> str:
        return self._visible(locator).text

    def _count(self, locator) -> int:
        self._visible(locator)
        return len(self.driver.find_elements(*locator))
