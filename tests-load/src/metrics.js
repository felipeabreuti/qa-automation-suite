import { Trend } from 'k6/metrics';

export const metrics = {
  recommendationDuration: new Trend('recommendation_duration', true),
  ratingsDuration: new Trend('ratings_duration', true),
};
