import { AIChatModerator } from '@utils/AIChatModerator';
import logger from '@config/logger';

jest.mock('@config/logger');

describe('AIChatModerator', () => {
  it('should moderate message', async () => {
    const result = await AIChatModerator.moderateMessage('test');
    expect(result).toBe(true);
  });
});
