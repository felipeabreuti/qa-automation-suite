# Testes de API — serverest.dev

Testes de contrato e fluxo contra a API pública [serverest.dev](https://serverest.dev), com Playwright Test (`APIRequestContext`) e TypeScript. Não usam browser, então não é necessário instalar os binários do Playwright.

## Pré-requisitos

- Node.js 22 (versão usada no CI; mínimo 20, exigido pelo Playwright).

## Execução

```bash
npm install
npm test
```

Relatório HTML: `npm run test:report` (gera em `playwright-report/index.html`).

## Configuração

`BASE_URL` é opcional (padrão `https://serverest.dev`). Para apontar para outro ambiente, copie `.env.example` para `.env` ou exporte a variável no shell/CI.

## Estrutura

```
tests-api/
├── playwright.config.ts
├── src/
│   ├── data/
│   │   ├── factories.ts   # buildUser, buildProduct e geradores únicos
│   │   └── users.ts       # credenciais seed, ids e constantes de massa
│   └── fixtures/
│       └── api.fixture.ts # fixture adminToken
└── tests/
    ├── login.spec.ts
    ├── usuarios.spec.ts
    └── produtos.spec.ts
```

## Decisões

- **Sem credencial persistida.** A fixture `adminToken` registra um admin novo a cada teste e faz login; nada fixo além do usuário seed `fulano@qa.com`, que a própria API mantém.
- **Massa única por execução.** O ambiente é público e compartilhado; emails e nomes de produto são gerados com sufixo aleatório + timestamp para não colidir com outras execuções.
- **Camada de dados separada do oráculo.** Entradas (payloads, ids, credenciais) ficam em `src/data/`; mensagens e status esperados ficam no spec, ao lado do `expect`, porque são o contrato sendo verificado.
- **Asserts verificam efeito, não só mensagem.** POST confirma o recurso via GET; PUT confirma o campo alterado; DELETE confirma o 400 posterior.
- **Status antes do corpo.** `expect(status)` vem antes de `response.json()` para que uma resposta não-JSON falhe apontando o status errado, não um erro de parse.
