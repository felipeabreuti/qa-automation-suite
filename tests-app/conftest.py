import base64
import logging
import os
from datetime import datetime

import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from dotenv import load_dotenv
from pytest_html import extras
from pytest_metadata.plugin import metadata_key

from browserstack import BrowserStackAnnotationHandler, BrowserStackSession

load_dotenv()

HUB_URL = 'https://hub.browserstack.com/wd/hub'
PROJECT_NAME = 'qa-automation-suite'
DEVICE = {'name': 'Google Pixel 8', 'platform_version': '14.0'}
REQUIRED_ENV = ('BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP_URL')


def _build_name() -> str:
    run_number = os.getenv('GITHUB_RUN_NUMBER')
    if run_number:
        return f'qa-mobile-suite #{run_number}'
    return f'qa-mobile-suite local {datetime.now():%Y-%m-%d %H:%M}'


BUILD_NAME = _build_name()


def pytest_configure(config):
    config.stash[metadata_key].update({
        'Suíte': 'Mobile — Appium + pytest',
        'Ambiente': 'BrowserStack App Automate',
        'Dispositivo': f'{DEVICE["name"]} · Android {DEVICE["platform_version"]}',
        'App': 'Swag Labs Mobile Sample App (com.swaglabsmobileapp)',
        'Build': BUILD_NAME,
    })


def pytest_sessionstart(session):
    missing = [name for name in REQUIRED_ENV if not os.getenv(name)]
    if missing:
        raise pytest.UsageError(f'Variáveis de ambiente obrigatórias ausentes: {", ".join(missing)} (veja .env.example)')


def pytest_html_report_title(report):
    report.title = 'QA Automation Suite — Mobile (Appium + BrowserStack)'


def pytest_html_results_table_header(cells):
    cells.insert(2, '<th>Descrição</th>')


def pytest_html_results_table_row(report, cells):
    cells.insert(2, f'<td>{getattr(report, "description", "")}</td>')


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    setattr(item, f'report_{report.when}', report)

    if report.when != 'call':
        return

    report.description = (item.function.__doc__ or '').strip()

    driver = item.funcargs.get('driver')
    session = item.funcargs.get('browserstack_session')
    if driver is None or session is None:
        return

    report.extras = [
        extras.png(base64.b64encode(driver.get_screenshot_as_png()).decode('ascii'), name='Tela final'),
        extras.url(session.public_url(), name='Sessão no BrowserStack (vídeo, logs e etapas)'),
    ]


@pytest.fixture
def driver(request):
    options = UiAutomator2Options().load_capabilities({
        'platformName': 'Android',
        'appium:platformVersion': DEVICE['platform_version'],
        'appium:deviceName': DEVICE['name'],
        'appium:app': os.environ['BROWSERSTACK_APP_URL'],
        'appium:automationName': 'UiAutomator2',
        'bstack:options': {
            'userName': os.environ['BROWSERSTACK_USERNAME'],
            'accessKey': os.environ['BROWSERSTACK_ACCESS_KEY'],
            'projectName': PROJECT_NAME,
            'buildName': BUILD_NAME,
            'sessionName': request.node.name,
            'debug': True,
            'networkLogs': False,
        },
    })

    driver_instance = webdriver.Remote(command_executor=HUB_URL, options=options)
    try:
        yield driver_instance
    finally:
        driver_instance.quit()


@pytest.fixture(autouse=True)
def browserstack_session(request, driver):
    session = BrowserStackSession(
        driver,
        username=os.environ['BROWSERSTACK_USERNAME'],
        access_key=os.environ['BROWSERSTACK_ACCESS_KEY'],
    )
    handler = BrowserStackAnnotationHandler(session)
    logging.getLogger('steps').addHandler(handler)

    yield session

    logging.getLogger('steps').removeHandler(handler)
    report = getattr(request.node, 'report_call', None)
    if report is None:
        session.set_status(passed=False, reason='Teste não chegou à fase de execução')
    elif report.passed:
        session.set_status(passed=True, reason='Todas as asserções passaram')
    else:
        session.set_status(passed=False, reason=_failure_reason(report))


def _failure_reason(report) -> str:
    crash = getattr(report.longrepr, 'reprcrash', None)
    return crash.message if crash else report.longreprtext
