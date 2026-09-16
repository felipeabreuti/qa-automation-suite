const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'abcdef0123456789';

export const config = {
  baseUrl: BASE_URL,
  authHeader: `token ${AUTH_TOKEN}`,
  stages: [
    { duration: '30s', target: 100 },
    { duration: '4m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    checks: ['rate>0.99'],
  },
};
