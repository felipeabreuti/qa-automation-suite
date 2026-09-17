import json
import logging
import unicodedata

import requests

SESSIONS_API = 'https://api-cloud.browserstack.com/app-automate/sessions/{session_id}.json'


# O executor do BrowserStack corrompe caracteres não-ASCII
def _ascii(text: str) -> str:
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')


class BrowserStackSession:
    def __init__(self, driver, username: str, access_key: str):
        self.driver = driver
        self._auth = (username, access_key)

    def annotate(self, message: str, level: str = 'info'):
        self._execute('annotate', {'data': _ascii(message), 'level': level})

    def set_status(self, passed: bool, reason: str = ''):
        status = 'passed' if passed else 'failed'
        self._execute('setSessionStatus', {'status': status, 'reason': _ascii(reason)[:255]})

    def public_url(self) -> str:
        response = requests.get(
            SESSIONS_API.format(session_id=self.driver.session_id),
            auth=self._auth,
            timeout=15,
        )
        response.raise_for_status()
        return response.json()['automation_session']['public_url']

    def _execute(self, action: str, arguments: dict):
        payload = json.dumps({'action': action, 'arguments': arguments})
        self.driver.execute_script(f'browserstack_executor: {payload}')


class BrowserStackAnnotationHandler(logging.Handler):
    def __init__(self, session: BrowserStackSession):
        super().__init__()
        self.session = session

    def emit(self, record: logging.LogRecord):
        level = 'error' if record.levelno >= logging.ERROR else 'info'
        self.session.annotate(record.getMessage(), level)
