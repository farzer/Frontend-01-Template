const lr = require('./lr')

describe('Test LR', () => {
  it('should return boolean', () => {
    expect(typeof lr('(a(b)c)')).toBe('boolean')
    expect(typeof lr('(a(bc)')).toBe('boolean')
  });
});