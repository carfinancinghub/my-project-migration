// Date: 062525 [1857], © 2025 CFH
const logger = require('@utils/logger');
describe('Logger Utility', () => {
  let infoSpy, warnSpy, errorSpy;
  beforeEach(() => {
    infoSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
  it('should log info messages', () => {
    logger.info('Test info');
    expect(infoSpy).toHaveBeenCalledWith('Test info');
  });
});


