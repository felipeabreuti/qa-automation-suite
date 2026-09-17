# QA Automation Suite

Suítes de automação de testes do desafio técnico. Cada pasta é um projeto independente, com stack, pré-requisitos e README próprios.

| Suíte | Stack | Alvo | Docs |
|---|---|---|---|
| `tests-api/` | Playwright Test + TypeScript | API pública [serverest.dev](https://serverest.dev) | [README](tests-api/README.md) |
| `tests-e2e/` | Playwright Test + TypeScript (Chromium) | [SauceDemo](https://www.saucedemo.com) — login e navegação até o checkout | [README](tests-e2e/README.md) |
| `tests-app/` | Appium + pytest (Python) | [Swag Labs Mobile](https://github.com/saucelabs/sample-app-mobile) no BrowserStack App Automate — login e formulário de checkout | [README](tests-app/README.md) |
| `tests-load/` | k6 | Grafana QuickPizza (demo oficial do k6) | [README](tests-load/README.md) |

## CI/CD

O workflow em `.github/workflows/tests.yml` roda as suítes em jobs paralelos e publica o relatório HTML de cada uma como artefato:

- **API e E2E**: a cada `push` e `pull_request`.
- **Mobile**: apenas em `pull_request` do próprio repositório ou disparo manual (`workflow_dispatch`), porque consome minutos do plano BrowserStack. Depende dos secrets `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` e `BROWSERSTACK_APP_URL`; PRs de fork não recebem secrets e não executam esse job.

O teste de carga fica fora do pipeline por ser de execução manual e longa.
