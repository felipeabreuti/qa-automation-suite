from appium.webdriver.common.appiumby import AppiumBy

LOGIN_SCREEN = (AppiumBy.ACCESSIBILITY_ID, 'test-Login')
USERNAME_INPUT = (AppiumBy.ACCESSIBILITY_ID, 'test-Username')
PASSWORD_INPUT = (AppiumBy.ACCESSIBILITY_ID, 'test-Password')
LOGIN_BUTTON = (AppiumBy.ACCESSIBILITY_ID, 'test-LOGIN')
# O container tem o content-desc; o texto fica no TextView filho
ERROR_MESSAGE_TEXT = (AppiumBy.XPATH, '//*[@content-desc="test-Error message"]//android.widget.TextView')
