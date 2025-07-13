import { HaulerMissionsEngine } from '@utils/HaulerMissionsEngine';

describe('HaulerMissionsEngine', () => {
  it('should assign mission', async () => {
    const result = await HaulerMissionsEngine.assignMission('user1');
    expect(result).toEqual({ mission: 'mock' });
  });
});
