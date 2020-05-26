const parser = require('./parser')

describe('Step 3: parse Tag', () => {
  test('state should EOF Symbol', () => {
    expect(typeof parser.parseHTML('')).toBe('symbol')
  });
});