import { predictDelay } from '@utils/SmartDelayPredictor';
import { expect } from '@jest/globals';

describe('SmartDelayPredictor', () => {
  it('should predict delay', async () => {
    const result = await predictDelay({ data: 'mock' });
    expect(result).toEqual(0);
  });
});
