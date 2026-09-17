import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/3.0.4/dist/bundle.js';
import { config } from './src/config.js';
import { userFlow } from './src/scenarios.js';

export const options = {
  stages: config.stages,
  thresholds: config.thresholds,
};

export default function () {
  userFlow();
}

export function handleSummary(data) {
  return {
    'report/summary.html': htmlReport(data),
    'report/summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

