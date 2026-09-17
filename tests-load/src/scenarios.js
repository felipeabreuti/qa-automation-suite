import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';
import { metrics } from './metrics.js';

function thinkTime(minSeconds, maxSeconds) {
  sleep(minSeconds + Math.random() * (maxSeconds - minSeconds));
}

const authHeaders = {
  headers: { 'Content-Type': 'application/json', 'Authorization': config.authHeader },
};

export function userFlow() {
  const recommendationRes = http.post(
    `${config.baseUrl}/api/pizza`,
    JSON.stringify({
      maxCaloriesPerSlice: 1000,
      mustBeVegetarian: false,
      excludedIngredients: [],
      excludedTools: [],
      maxNumberOfToppings: 5,
      minNumberOfToppings: 2,
    }),
    authHeaders
  );
  metrics.recommendationDuration.add(recommendationRes.timings.duration);

  check(recommendationRes, {
    'POST /api/pizza status 200': (r) => r.status === 200,
    'POST /api/pizza retorna pizza': (r) => r.json('pizza.name') !== undefined,
  });

  thinkTime(1, 3);

  const ratingsRes = http.get(`${config.baseUrl}/api/ratings`, authHeaders);
  metrics.ratingsDuration.add(ratingsRes.timings.duration);

  check(ratingsRes, {
    'GET /api/ratings status 200': (r) => r.status === 200,
    'GET /api/ratings tem corpo': (r) => r.body && r.body.length > 0,
  });

  thinkTime(1, 3);
}
