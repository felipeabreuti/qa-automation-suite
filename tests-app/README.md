# Testes Mobile — Swag Labs (Android)

Automação mobile com Appium + pytest, executada em nuvem no [BrowserStack App Automate](https://www.browserstack.com/app-automate) (Google Pixel 8, Android 14). App alvo: [Swag Labs Mobile Sample App](https://github.com/saucelabs/sample-app-mobile) (`com.swaglabsmobileapp`).

## Pré-requisitos

- Python 3.12.
- Conta no BrowserStack App Automate com o `.apk` enviado (App Management → Upload). O APK vem das [releases do sample-app-mobile](https://github.com/saucelabs/sample-app-mobile/releases); não é versionado aqui.

## Configuração

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `BROWSERSTACK_USERNAME` | usuário da conta |
| `BROWSERSTACK_ACCESS_KEY` | access key da conta |
| `BROWSERSTACK_APP_URL` | `bs://...` retornado pelo upload do APK |

No CI, as três ficam como secrets do GitHub. A suíte falha imediatamente, antes de abrir qualquer sessão, se alguma estiver ausente.

## Execução

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
pytest
```

Relatório HTML: `report/report.html` (self-contained). Para cada teste: descrição, log de etapas, screenshot final e link público para a sessão no BrowserStack (vídeo, Visual Logs por comando, Appium/device logs).

## Estrutura

```
tests-app/
├── pytest.ini              # pythonpath=src, relatório HTML, formato de log
├── conftest.py             # fixture driver, status/anotações no BrowserStack, hooks do relatório
├── src/
│   ├── browserstack.py     # executor: setSessionStatus, annotate, public_url
│   ├── data/               # Credentials, PersonalInfo
│   ├── locators/           # (AppiumBy, valor) por tela
│   └── screens/            # BaseScreen + Login, Catalog, Cart, Checkout
└── tests/
    ├── test_login_navigation.py
    └── test_checkout_form_submission.py
```

## Cobertura

| Teste | Cenário | Oráculo |
|---|---|---|
| `test_login_valid_user_reaches_catalog` | `standard_user` faz login | tela `PRODUCTS` visível |
| `test_login_locked_out_user_shows_error` | `locked_out_user` | mensagem exata de bloqueio + permanece na tela de login |
| `test_checkout_form_submission_reaches_overview` | login → adiciona item → carrinho → formulário → resumo | badge do carrinho = 1, 1 item no carrinho, tela `Checkout: Your Info`, tela `CHECKOUT: OVERVIEW` |

## Decisões

- **Sessão marcada no BrowserStack.** O `assert` do pytest é local; a sessão só recebe `passed`/`failed` via `browserstack_executor: setSessionStatus`, chamado no teardown com o resultado real e a mensagem da falha como motivo. Sem isso a sessão fica *Unmarked*.
- **Etapas visíveis nos dois relatórios.** Cada ação de tela loga uma etapa (`logging`); um `Handler` reenvia como `annotate` para a timeline do BrowserStack, e o pytest captura o mesmo log no HTML. `debug: true` liga os Visual Logs (screenshot por comando) no dashboard.
- **Um build por execução.** `buildName` usa `GITHUB_RUN_NUMBER` no CI ou timestamp local, e `sessionName` é o nome do teste — o dashboard agrupa a execução e identifica cada teste.
- **Driver por teste.** A fixture `driver` cria e encerra a sessão a cada teste; isolamento total, sem estado compartilhado.
- **Camada de dados separada do oráculo.** Credenciais e dados de formulário em `src/data/`; mensagens e telas esperadas ficam no teste, ao lado do `assert`.
- **Screens retornam estado, testes afirmam.** Métodos `is_*`/`*_count`/`error_message` devolvem valores; o `assert` fica no teste com mensagem própria — o relatório mostra o que era esperado.
- **Locators por accessibility id.** O app expõe `test-*` como `content-desc` em todos os elementos interativos (confirmado no código-fonte: `TestProperties.js` + `translations/en.js`). Textos dentro de containers usam XPath descendente `android.widget.TextView`, porque o `content-desc` fica no `View` pai.
