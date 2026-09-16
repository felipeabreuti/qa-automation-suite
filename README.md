# QA Automation Suite

Suítes de automação de testes do desafio técnico. Cada pasta é um projeto independente, com stack, pré-requisitos e README próprios.

| Suíte | Stack | Alvo | Docs |
|---|---|---|---|
| `tests-api/` | Playwright Test + TypeScript | API pública [serverest.dev](https://serverest.dev) | [README](tests-api/README.md) |
| `tests-load/` | k6 | Grafana QuickPizza (demo oficial do k6) | [README](tests-load/README.md) |

## CI/CD

O workflow em `.github/workflows/tests.yml` roda a suíte de API a cada `push` e `pull_request` e publica o relatório HTML como artefato. O teste de carga fica fora do pipeline por ser de execução manual e longa.
