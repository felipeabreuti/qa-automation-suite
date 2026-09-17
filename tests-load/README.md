# Teste de carga — k6 (QuickPizza)

Teste de carga em k6 contra o [QuickPizza](https://quickpizza.grafana.com), app de demonstração oficial da Grafana para esse fim: 100 usuários virtuais por 5 minutos, simulando o fluxo recomendação → leitura de avaliações.

## Pré-requisitos

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) instalado (validado com 2.0.0).

## Execução

```bash
k6 run load-test.js
```

O `handleSummary` grava `report/summary.html` e `report/summary.json` a cada execução, além do resumo no terminal.

## Configuração

URL base e token podem ser sobrescritos via `-e` (funciona em qualquer shell, inclusive PowerShell):

```bash
k6 run -e BASE_URL=https://api.exemplo.com -e AUTH_TOKEN=seu-token load-test.js
```

## Estrutura

```
tests-load/
├── load-test.js      # entrypoint: options + handleSummary
├── src/
│   ├── config.js     # URL, token, stages e thresholds
│   ├── metrics.js    # Trends customizadas por endpoint
│   └── scenarios.js  # fluxo do usuário virtual
└── report/
    ├── ANALYSIS.md   # análise das execuções e gargalos identificados
    ├── summary.html  # evidência da última execução
    └── summary.json
```

## Cenário

| Fase      | Duração | VUs      |
|-----------|---------|----------|
| Ramp-up   | 30s     | 0 → 100  |
| Steady    | 4m      | 100      |
| Ramp-down | 30s     | 100 → 0  |

Cada iteração faz `POST /api/pizza` (recomendação, com cálculo combinatório) e `GET /api/ratings` (leitura), com think-time aleatório de 1–3s entre as chamadas.

## Thresholds

- `http_req_failed`: rate < 1%
- `http_req_duration`: p95 < 800ms, p99 < 1500ms
- `checks`: rate > 99%

## Decisões

- **Fora do pipeline.** É execução manual e longa (5 min de carga contra ambiente público); o enunciado limita o CI a API, E2E e mobile. A evidência fica versionada em `report/`.
- **Think-time aleatório**, não fixo — evita sincronização artificial entre os VUs, que gera picos irreais de concorrência.
- **Trend por endpoint** (`recommendation_duration`, `ratings_duration`) além do `http_req_duration` agregado — permite ver qual endpoint concentra a latência, não só o total.
- **Sem métrica de erro própria.** `checks` já mede a taxa de falha de asserção; uma `Rate` paralela seria o mesmo número com outro nome.
- **Reporter HTML pinado em tag** (`k6-reporter@3.0.4`), não em `main` — import remoto sem versão muda comportamento sem aviso.
- **Alvo trocado** do `test-api.k6.io` (descontinuado como API) para o QuickPizza — detalhes e resultados em [report/ANALYSIS.md](report/ANALYSIS.md).
