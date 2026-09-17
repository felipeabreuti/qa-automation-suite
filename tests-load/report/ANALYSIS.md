# Análise do teste de carga

## Cenário

- Alvo: [QuickPizza](https://quickpizza.grafana.com) — app oficial da Grafana para testes de carga com k6.
- 100 VUs por 5 minutos (30s ramp-up, 4m steady, 30s ramp-down).
- Fluxo por iteração: `POST /api/pizza` (recomendação, com cálculo combinatório de ingredientes) + `GET /api/ratings` (leitura), com think-time de 1-3s entre chamadas.
- O alvo original do script era o `test-api.k6.io`, mas esse domínio deixou de funcionar como API (`/user/register/` retorna 403 do CloudFront, `/public/crocodiles/` devolve o HTML de uma SPA). O QuickPizza é o ambiente que a própria Grafana disponibiliza para esse tipo de teste.

## Resultados

Quatro execuções do mesmo cenário, para não concluir a partir de uma amostra única. A run 4 é a que gerou os arquivos `summary.html` e `summary.json` versionados nesta pasta.

| Métrica                        | Run 1      | Run 2    | Run 3    | Run 4    |
|---------------------------------|------------|----------|----------|----------|
| Requisições                     | 12.432     | 12.530   | 12.464   | 12.512   |
| http_req_failed (rate)          | 0,17%      | 0%       | 0%       | 0%       |
| checks (rate)                   | 99,88%     | 100%     | 100%     | 100%     |
| http_req_duration p95           | 251,7 ms   | 249,7 ms | 250,3 ms | 251,2 ms |
| http_req_duration max           | 10.153 ms  | 353,9 ms | 349,4 ms | 442,9 ms |
| recommendation_duration (p95)   | 258,1 ms   | 256,0 ms | 255,5 ms | 256,5 ms |
| ratings_duration (p95)          | 153,2 ms   | 154,3 ms | 151,6 ms | 155,1 ms |

Todas passaram nos thresholds (`p95<800ms`, `p99<1500ms`, `http_req_failed<1%`, `checks>99%`).

## O que os números mostram

**100 VUs não estressam o sistema.** A latência ficou baixa e estável nas quatro execuções (p95 entre 249 e 252 ms), longe dos thresholds. Isso tem um efeito colateral: os thresholds herdados do script original (`p95<800ms`) têm ~3x de margem sobre o comportamento real, então não funcionam como gate de qualidade — uma regressão de 100% na latência ainda passaria.

**A run 1 teve um pico de ~10,15 s**, quase idêntico (diferença de 11 ms) em `ratings_duration` e `recommendation_duration`. Dois endpoints com lógica distinta travando ao mesmo tempo indica contenção compartilhada a montante (fila, conexão, cold start da infra pública), não defeito na lógica de um deles. As runs 2–4 não reproduziram; classifico como evento pontual, mas quatro amostras não descartam um problema raro e intermitente.

**`POST /api/pizza` é consistentemente ~40% mais lento que `GET /api/ratings`** (p95 ~256 ms vs ~154 ms). Esperado — a recomendação calcula combinações de ingredientes, ratings só lê — mas é o endpoint a observar primeiro se o tráfego de recomendação crescer.

## Recomendações

- Recalibrar os thresholds para a baseline real (`p95<400ms`, por exemplo); do jeito que estão, o teste não detecta regressão.
- Investigar o pico de 10 s com output bruto por timestamp (`k6 run --out json=report/raw.json`) para confirmar se é raro ou se segue um padrão (ex.: sempre perto do fim do steady state).
- Subir para 200–500 VUs: 100 VUs não chegou perto do limite, então o ponto de quebra ainda é desconhecido.
- Se o volume de recomendações crescer em produção, avaliar cache das combinações mais pedidas.

## Conclusão

O QuickPizza sustentou 100 VUs por 5 minutos sem violar threshold em quatro execuções. Dois pontos ficam em aberto antes de considerar essa carga validada: o pico isolado de 10 s na run 1 e a folga excessiva dos thresholds, que hoje não protegem contra regressão.

