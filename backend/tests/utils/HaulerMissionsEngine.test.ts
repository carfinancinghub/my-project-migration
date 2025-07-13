import { HaulerMissionsEngine } from '@utils/HaulerMissionsEngine';
import { expect } from '@jest/globals';

describe('HaulerMissionsEngine', () => {
  it('should assign mission', async () => {
    const result = await HaulerMissionsEngine.assignMission('user1');
    expect(result).toEqual({ mission: 'mock' });
  });
});
