let outputData = '';
const storeLog = inputs => (outputData += inputs)

describe('Step one: Split File', () => {
  test(`parser should console "hello world"`, () => {
    console['log'] = jest.fn(storeLog)
    require('./parser').parseHTML('hello world')
    expect(outputData).toBe('hello world')
  });
});