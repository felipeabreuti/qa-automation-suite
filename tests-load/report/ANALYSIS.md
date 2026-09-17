# Análise do teste de carga

## Cenário

- Alvo: [QuickPizza](https://quickpizza.grafana.com) — app oficial da Grafana para testes de carga com k6.
- 100 VUs por 5 minutos (30s ramp-up, 4m steady, 30s ramp-down).
- Fluxo por iteração: `POST /api/pizza` (recomendação, com cálculo combinatório de ingredientes) + `GET /api/ratings` (leitura), com think-time de 1-3s entre chamadas.
- O alvo original do script era o `test-api.k6.io`, mas esse domínio parou de funcionar como API (`/user/register/` retorna 403 do CloudFront, `/public/crocodiles/` devolve HTML de uma SPA). Troquei para o QuickPizza, que é o ambiente que a própria Grafana disponibiliza para esse tipo de teste.

## Resultados

Rodei o cenário 3 vezes para não tirar conclusão de uma amostra só:

| Métrica                        | Run 1       | Run 2    | Run 3    |
|---------------------------------|------------|----------|----------|
| Requisições                     | 12.432     | 12.530   | 12.464   |
| http_req_failed (rate)          | 0,17%      | 0%       | 0%       |
| checks (rate)                   | 99,88%     | 100%     | 100%     |
| http_req_duration p95           | 251,7 ms   | 249,7 ms | 250,3 ms |
| http_req_duration max           | 10.153 ms  | 353,9 ms | 349,4 ms |
| recommendation_duration (p95)   | 258,1 ms   | 256,0 ms | 255,5 ms |
| ratings_duration (p95)          | 153,2 ms   | 154,3 ms | 151,6 ms |

Todas as três passaram nos thresholds (`p95<800ms`, `p99<1500ms`, `http_req_failed<1%`, `checks>99%`).

## O que os números mostram

**O sistema aguenta 100 VUs numa boa — mas isso não quer dizer que não tenha gargalo, só que não achamos o limite ainda.** Latência ficou baixa e estável nas três execuções (p95 sempre entre 249-252ms), bem longe dos thresholds. Isso é bom, mas também é um sinal de alerta: os thresholds herdados do script original (`p95<800ms`) têm quase 3x de margem em relação ao que realmente acontece, então não servem como gate de qualidade — uma regressão real de performance passaria despercebida.

**A run 1 teve um pico de ~10,15s**, quase idêntico (diferença de 11ms) em `ratings_duration` e `recommendation_duration` — dois endpoints com lógica totalmente diferente travando ao mesmo tempo aponta pra alguma contenção compartilhada a montante (fila, conexão, cold start da infra pública), não pra um bug de código. Como as runs 2 e 3 não reproduziram nada parecido, trato como evento pontual — mas não descarto, porque 3 amostras não são garantia contra um problema raro e intermitente.

O outro achado consistente nas três runs: **`POST /api/pizza` é sempre ~40% mais lento que `GET /api/ratings`** (p95 ~256ms vs ~153ms). Faz sentido — a recomendação calcula combinações de ingredientes, ratings só lê — mas é o endpoint a olhar primeiro se o tráfego de recomendação crescer.

## Recomendações

- Recalibrar os thresholds pra baseline real (`p95<400ms`, por exemplo) — do jeito que está, o teste não detecta regressão nenhuma.
- Investigar o pico de 10s com output bruto por timestamp (`k6 run --out json=report/raw.json`) pra confirmar se é mesmo raro ou se acontece em um padrão (ex.: sempre perto do fim do steady state).
- Subir pra 200-500 VUs — 100 VUs não chegou perto de estressar o sistema, então ainda não sabemos onde ele quebra.
- Se o volume de recomendações crescer em produção, considerar cache de combinações populares.

## Conclusão

O QuickPizza sustentou 100 VUs por 5 minutos sem violar nenhum threshold, em três execuções seguidas. Isso é um resultado positivo, mas não é o fim da história: o pico isolado de 10s e a folga excessiva dos thresholds são os dois pontos que eu levaria pra próxima rodada de testes antes de considerar essa carga "validada" de verdade.

