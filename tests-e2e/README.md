# Testes E2E — SauceDemo

Testes de login e navegação até o formulário de checkout do [SauceDemo](https://www.saucedemo.com), com Playwright Test + TypeScript em Chromium.

## Pré-requisitos

- Node.js 20 ou superior.

## Execução

```bash
npm install
npx playwright install --with-deps chromium
npm test
```

Para acompanhar o browser localmente: `npm run test:headed`.

Relatório HTML: `npm run test:report` (gera em `playwright-report/index.html`). Cada teste, inclusive os que passam, anexa screenshot final e trace completo — o trace abre no próprio relatório com filmstrip, snapshot do DOM e rede de cada ação.

## Estrutura

```
tests-e2e/
├── playwright.config.ts
├── src/
│   ├── data/
│   │   └── users.ts            # credenciais públicas do SauceDemo
│   ├── fixtures/
│   │   └── pages.fixture.ts    # injeta os Page Objects como fixtures
│   ├── locators/               # só seletores, um arquivo por página
│   └── pages/                  # LoginPage, InventoryPage, CartPage, CheckoutPage
└── tests/
    ├── login.spec.ts
    └── checkout-form-navigation.spec.ts
```

## Cobertura

| Spec | Cenário | Oráculo |
|---|---|---|
| `login.spec.ts` | `standard_user` faz login | URL `/inventory.html` + título `Products` |
| `login.spec.ts` | `locked_out_user` | mensagem exata de bloqueio + permanece na URL de login |
| `login.spec.ts` | senha inválida | mensagem exata de credenciais + permanece na URL de login |
| `checkout-form-navigation.spec.ts` | catálogo → carrinho → checkout | badge do carrinho = 1, carrinho com 1 item, URL `/checkout-step-one.html` + campos do formulário visíveis |

## Decisões

- **Page Object + fixture.** Page Objects entregues via `test.extend`; cada teste recebe instâncias prontas em um `BrowserContext` isolado, o que permite `fullyParallel`.
- **Três camadas.** `locators/` só tem seletores, `pages/` só tem ações e asserções da página, `tests/` só orquestra. Nenhum seletor solto em spec.
- **Camada de dados separada do oráculo.** Credenciais ficam em `src/data/`; textos e URLs esperados ficam no spec ou no método `expect*` da page, porque são o contrato verificado.
- **Asserções por URL e texto, não só visibilidade.** Cada transição de página confirma a rota e o título; erros de login confirmam a mensagem exata.
- **Headless por padrão.** Necessário para rodar no CI (`ubuntu-latest` não tem display); `--headed` fica disponível via script para depuração local.
