from appium.webdriver.common.appiumby import AppiumBy

CATALOG_SCREEN = (AppiumBy.ACCESSIBILITY_ID, 'test-PRODUCTS')
ADD_TO_CART_BUTTON = (AppiumBy.ACCESSIBILITY_ID, 'test-ADD TO CART')
CART_BUTTON = (AppiumBy.ACCESSIBILITY_ID, 'test-Cart')
CART_BADGE_TEXT = (AppiumBy.XPATH, '//*[@content-desc="test-Cart"]//android.widget.TextView')
