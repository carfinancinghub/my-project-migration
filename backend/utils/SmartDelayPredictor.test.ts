// File: SmartDelayPredictor.test.js
// Path: backend/utils/SmartDelayPredictor.test.js
// Author: Cod3 (05051024)

import { predictDelay } from '@utils/SmartDelayPredictor';

test('predicts delay for delivery', () => {
  const result = predictDelay('d001', [2, 2.5, 3]);
  expect(result).toHaveProperty('prediction');
});
