// Date: 062625 [1000], © 2025 CFH
import { TrustScoreEngine } from '@services/ai/TrustScoreEngine';
describe('TrustScoreEngine', () => {
  const engine = new TrustScoreEngine();
  it('calculates trust score', async () => {
    const result = await engine.calculateScore('user1');
    expect(result).toHaveProperty('score');
  });
});
