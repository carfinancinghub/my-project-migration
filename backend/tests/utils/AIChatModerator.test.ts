import { AIChatModerator } from '@utils/AIChatModerator';
import logger from '@config/logger';
import { expect } from '@jest/globals';

jest.mock('@config/logger');

describe('AIChatModerator', () => {
  it('should moderate message', async () => {
    const result = await AIChatModerator.moderateMessage('test');
    expect(result).toEqual(true);
  });
});
